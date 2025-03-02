import { BigNumber, ethers } from 'ethers'
import { addresses } from '../addresses'
import { CHAIN_IDS, JSON_RPC } from '../default-config'
import IZeroEx from '../abis/IZeroEx.json'
import { getPrismaClient } from '../prisma-client'
// Adresse du contrat

const prisma = getPrismaClient()

// Fonction générique pour mettre à jour le statut de l'ordre
async function updateOrderStatus(nonce: BigNumber, newStatus: string) {
  const nonceAsString = nonce.toString()
  try {
    const order = await prisma.orders_with_latest_status.findFirst({
      where: {
        nonce: nonceAsString,
      },
    })
    if (order) {
      console.log('Found order', order.nonce, 'with status', order.order_status)
      await prisma.orders_with_latest_status.update({
        where: { nonce: order.nonce },
        data: { order_status: newStatus },
      })
      console.log(`Order ${nonceAsString} updated to '${newStatus}'.`)
    } else {
      console.log(`Order ${nonceAsString} not found.`)
    }
  } catch (error) {
    console.error('Error updating order status:', error)
  }
}

export function startEventListeners() {
  // NEBULA TESTNET
  const providerNebulaTestnet = new ethers.providers.JsonRpcProvider(JSON_RPC[CHAIN_IDS.NEBULA_TESTNET])
  const contractNebulaTestnet = new ethers.Contract(
    addresses[CHAIN_IDS.NEBULA_TESTNET]?.exchange.toString()!,
    IZeroEx.compilerOutput.abi,
    providerNebulaTestnet
  )
  contractNebulaTestnet.on(
    contractNebulaTestnet.filters.ERC1155OrderFilled(),
    async (
      direction,
      maker,
      taker,
      nonce,
      erc20Token,
      erc20FillAmount,
      erc1155Token,
      erc1155TokenId,
      erc1155FillAmount,
      matcher
    ) => {
      console.log('ERC1155 Order Filled:', { maker, nonce })
      await updateOrderStatus(nonce, 'filled')
    }
  )

  contractNebulaTestnet.on(contractNebulaTestnet.filters.ERC1155OrderCancelled(), async (maker, nonce) => {
    console.log('ERC1155 Order Cancelled:', { maker, nonce })
    await updateOrderStatus(nonce, 'cancelled')
  })

  contractNebulaTestnet.on(
    contractNebulaTestnet.filters.ERC721OrderFilled(),
    async (direction, maker, taker, nonce, erc20Token, erc20TokenAmount, erc721Token, erc721TokenId, matcher) => {
      console.log('ERC721 Order Filled:', { maker, nonce })
      await updateOrderStatus(nonce, 'filled')
    }
  )

  contractNebulaTestnet.on(contractNebulaTestnet.filters.ERC721OrderCancelled(), async (maker, nonce) => {
    console.log('ERC721 Order Cancelled:', { maker, nonce })
    await updateOrderStatus(nonce, 'cancelled')
  })

  // NEBULA MAINNET
  const providerNebulaMainnet = new ethers.providers.JsonRpcProvider('https://green-giddy-denebola-indexer.skalenodes.com:10136/')
  const contractNebulaMainnet = new ethers.Contract(
    addresses[CHAIN_IDS.NEBULA_MAINNET]?.exchange.toString()!,
    IZeroEx.compilerOutput.abi,
    providerNebulaMainnet
  )
  contractNebulaMainnet.on(
    contractNebulaMainnet.filters.ERC1155OrderFilled(),
    async (
      direction,
      maker,
      taker,
      nonce,
      erc20Token,
      erc20FillAmount,
      erc1155Token,
      erc1155TokenId,
      erc1155FillAmount,
      matcher
    ) => {
      console.log('ERC1155 Order Filled:', { maker, nonce })
      await updateOrderStatus(nonce, 'filled')
    }
  )

  contractNebulaMainnet.on(contractNebulaMainnet.filters.ERC1155OrderCancelled(), async (maker, nonce) => {
    console.log('ERC1155 Order Cancelled:', { maker, nonce })
    await updateOrderStatus(nonce, 'cancelled')
  })

  contractNebulaMainnet.on(
    contractNebulaMainnet.filters.ERC721OrderFilled(),
    async (direction, maker, taker, nonce, erc20Token, erc20TokenAmount, erc721Token, erc721TokenId, matcher) => {
      console.log('ERC721 Order Filled:', { maker, nonce })
      await updateOrderStatus(nonce, 'filled')
    }
  )

  contractNebulaMainnet.on(contractNebulaMainnet.filters.ERC721OrderCancelled(), async (maker, nonce) => {
    console.log('ERC721 Order Cancelled:', { maker, nonce })
    await updateOrderStatus(nonce, 'cancelled')
  })

  console.log('Event listeners started.')
}