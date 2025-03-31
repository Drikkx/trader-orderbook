import { JsonRpcBatchProvider } from '@ethersproject/providers'
import { PrismaClient, orders_with_latest_status } from '@prisma/client'
import { getJsonRpcUrlByChainId, getZeroExContract } from '../default-config'
import { NftSwapV4 } from 'flag-nft-swap-sdk'
import { SignedNftOrderV4Serialized } from '../types'
import { signedNftOrderV4SerializedSchema } from '../validations'

const prisma = new PrismaClient()

// Simule la récupération d'une liste de commandes à vérifier
async function fetchOrdersToCheck(): Promise<orders_with_latest_status[]> {
  // Cet exemple retourne toutes les commandes where order_status == 'open'
  return await prisma.orders_with_latest_status.findMany({
    where: { order_status: 'open' },
  })
}

// Simule la vérification du statut d'une commande spécifique
async function checkOrderStatus(order: orders_with_latest_status): Promise<'open' | 'expired'> {
  // Cet exemple vérifie si la commande a expiré
  const now = new Date()
  if (now > order.expiry_datetime) {
    return 'expired'
  } else {
    return 'open'
  }
}

// Fonction pour mettre à jour le statut d'une commande dans la base de données
async function updateOrderStatus(nonce: string, newStatus: 'open' | 'filled' | 'expired' | 'cancelled'): Promise<void> {

  // if statut is expired or cancelled, delete the order from the database
  if (newStatus === 'expired' || newStatus === 'cancelled') {
    await prisma.orders_with_latest_status.delete({
      where: { nonce: nonce },
    })
    await prisma.orders_v4_nfts.deleteMany({
      where: { nonce: nonce },
    })
    return
  }

  await prisma.orders_with_latest_status.update({
    where: { nonce: nonce },
    data: { order_status: newStatus },
  })
}

// Fonction principale pour vérifier et mettre à jour le statut de toutes les commandes
export async function checkAndUpdateAllOrderStatuses(): Promise<void> {
  const orders = await fetchOrdersToCheck()
  for (const order of orders) {
    const newStatus = await checkOrderStatus(order)
    const jsonRpcUrl = getJsonRpcUrlByChainId(order.chain_id)
    const jsonRpc = new JsonRpcBatchProvider(jsonRpcUrl, order.chain_id)
    if (newStatus === 'open') {
      const orderV4 = await prisma.orders_v4_nfts.findFirst({
        where: { nonce: order.nonce },
      })
      const signedOrder: SignedNftOrderV4Serialized = signedNftOrderV4SerializedSchema.parse(orderV4)

      const sdk = new NftSwapV4(jsonRpc, undefined as any, order.chain_id, {
        // Provide exchangeproxy address manually so we don't depend on the sdk for addresses
        zeroExExchangeProxyContractAddress: getZeroExContract(order.chain_id),
      })
      const fillableDataPromise = sdk.checkOrderCanBeFilledMakerSide(signedOrder)
      const fillableData = await fillableDataPromise
      if (fillableData.canOrderBeFilled) {
        await updateOrderStatus(order.nonce, 'filled')
      } else {
        await updateOrderStatus(order.nonce, 'cancelled')
      }
    }
    console.log(`Order ${order.nonce} updated to status: ${newStatus}`)
  }
}
