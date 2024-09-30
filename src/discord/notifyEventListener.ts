import { Client, EmbedBuilder, TextChannel } from 'discord.js';
import { appEvents } from '../api/orderbook';
import { NftOrderV4DatabaseModel } from '../types-complex';

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
    'Ticket Smuggler'
}

const nftAddressToNftName = {
    '0x176eC150950aecDC19B30721EAAf6124B34Fc816': 'Recruiter',
    '0xE0515a8E55788315ABBf356a8F4a925FCBe45ec2': 'Tavern',
    '0x7b1A00e4e8265A99ecE67077b2027f74f02996A9': 'Brothel',
    '0x75C02EF8D64F3C12f36f40f6CD48943A1020307C': 'Forge',
    '0x0C9F75C9333275B4A774c8B5b2Bb4c5dC929E5D0': 'Shipyard',
    '0x1Be33be2cD83793184250b30B91fA2d76246AA27': 'Character',
    '0x6b71c274bEFF4eB912af28c25Ed93f0E5256De11': 'Ship',
    '0xe23a53924A94AE48f484A3195f37AAf5B00b134B': 'Gear',
    '0x83eBFF5DF4427c3b539904446200598e3DB41f69': 'Stuff',
}

export const notifyEventListener = (bot: Client) => {
    console.log('notifyEventListener started')

    const channelId = '1290264812949082244';

    appEvents.on('notifyDiscord', async (data: Data) => {
        try {
            // Vérifiez que l'ID du canal est bien une chaîne
            if (typeof channelId === 'string') {
                // Récupérer le canal en utilisant l'ID
                const channel = await bot.channels.fetch(channelId) as TextChannel;

                // Créer un nouveau message intégré
                const embed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle('Market Listing')
                    .setTimestamp()

                let price = (Number(data.order.erc20_token_amount) + (Number(data.order.fees![0].amount))) / (10 ** 18)
                if (data.order.nft_type === 'ERC1155') {

                    embed.addFields(
                        {
                            name: `Asset`, value: `${TheTreasureSeaEnum[Number(data.order.nft_token_id)]}`
                        },
                    )
                    console.log(TheTreasureSeaEnum[Number(data.order.nft_token_id)])
                    embed.addFields(
                        {
                            name: `Amount`, value: `${data.order.nft_token_amount}`
                        },
                    )

                    embed.addFields(
                        {
                            name: `Price`, value: `${(price).toFixed(6)}`
                        },
                    )
                } else {
                    embed.addFields(
                        {
                            name: `Asset`, value: `${nftAddressToNftName[data.order.nft_token]}`
                        },
                    )

                    embed.addFields(
                        {
                            name: `Price`, value: `${(price).toFixed(6)}`
                        },
                    )
                }

                // Envoyer le message intégré au canal
                await channel.send({ embeds: [embed] });
                console.log('Message envoyé dans le canal Discord.');
            } else {
                throw new Error('L\'ID du canal n\'est pas défini dans les variables d\'environnement.');
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message dans le canal Discord:', error);
        }
    })
}