import { Client, EmbedBuilder, TextChannel } from 'discord.js'
import { appEvents } from '../api/orderbook'
import { NftOrderV4DatabaseModel } from '../types-complex'
import StepAsset from '../discord/store/contracts/StepAsset.json'
import { forEach } from 'lodash'

interface Data {
  order: NftOrderV4DatabaseModel
}

enum TheTreasureSeaEnum {
  'Coin Copper',
  'Coin Silver',
  'Coin Gold',
  'Chest Common',
  'Chest Rare',
  'Chest Legendary',
  'Compass',
  'Rum Bottle',
  'Map Common',
  'Map Rare',
  'Map Legendary',
  'Ticket Pirate',
  'Ticket Corsair',
  'Ticket Smuggler',
}

const getContractName = (contractAddress: string) => {
  const contract = contractAddress.toLowerCase()
  console.log('Contract Address : ' + contract)
  if (contract === StepAsset.nftBrothelAddress.toLowerCase()) return 'Brothel'
  else if (contract === StepAsset.nftCharacterAddress.toLowerCase()) return 'Character'
  else if (contract === StepAsset.nftCollectibleAddress.toLowerCase()) return 'Recruiter'
  else if (contract === StepAsset.nftForgesAddress.toLowerCase()) return 'Forge'
  else if (contract === StepAsset.nftGearAddress.toLowerCase()) return 'Gear'
  else if (contract === StepAsset.nftShipAddress.toLowerCase()) return 'Ship'
  else if (contract === StepAsset.nftShipyardsAddress.toLowerCase()) return 'Shipyard'
  else if (contract === StepAsset.nftStuffAddress.toLowerCase()) return 'Stuff'
  else if (contract === StepAsset.nftTavernAddress.toLowerCase()) return 'Tavern'
  else return null
}

export const notifyEventListener = (bot: Client) => {
  console.log('notifyEventListener started')

  const channelId = '1290264812949082244'

  appEvents.on('notifyDiscord', async (data: Data) => {
    try {
      const contractName = getContractName(data.order.nft_token)
      if (contractName === null) return
      // Vérifiez que l'ID du canal est bien une chaîne
      if (typeof channelId === 'string') {
        // Récupérer le canal en utilisant l'ID
        const channel = (await bot.channels.fetch(channelId)) as TextChannel

        // Créer un nouveau message intégré
        const embed = new EmbedBuilder().setColor(0x0099ff).setTitle('Market Listing').setTimestamp()

        let price = (Number(data.order.erc20_token_amount) + Number(data.order.fees![0].amount)) / 10 ** 18
        if (data.order.nft_type === 'ERC1155') {
          embed.addFields({
            name: `Asset`,
            value: `${TheTreasureSeaEnum[Number(data.order.nft_token_id)]}`,
          })

          embed.addFields({
            name: `Amount`,
            value: `${data.order.nft_token_amount}`,
          })

          embed.addFields({
            name: `Price`,
            value: `${price.toFixed(6)}`,
          })
        } else {
          embed.addFields({
            name: `Asset`,
            value: `${getContractName(data.order.nft_token)}`,
          })

          embed.addFields({
            name: `Price`,
            value: `${price.toFixed(6)}`,
          })
        }

        // Envoyer le message intégré au canal
        await channel.send({ embeds: [embed] })
        console.log('Message envoyé dans le canal Discord.')
      } else {
        throw new Error("L'ID du canal n'est pas défini dans les variables d'environnement.")
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message dans le canal Discord:", error)
    }
  })
}
