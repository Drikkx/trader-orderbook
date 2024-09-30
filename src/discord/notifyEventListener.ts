import { Client, EmbedBuilder, TextChannel } from 'discord.js';
import { appEvents } from '../api/orderbook';
import { NftOrderV4DatabaseModel } from '../types-complex';

interface Data {
    order: NftOrderV4DatabaseModel
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

                // // Créer un nouveau message intégré
                // const embed = new EmbedBuilder()
                //     .setColor(0x0099FF)
                //     .setTitle('Market Listing')
                //     .setDescription(data.message)
                //     .setTimestamp()

                // embed.addFields(
                //     {
                //         name: `Score: ${data.user.score}`, value: `<@${data.user.discordId}>`
                //     },
                // )

                // const fields = Object.entries(data.stats).map(([key, value]) => {
                //     return { name: String(key), value: String(value), inline: false }
                // })

                // embed.addFields(...fields)

                // // Envoyer le message intégré au canal
                // await channel.send({ embeds: [embed] });
                await channel.send(data.order)
                console.log('Message envoyé dans le canal Discord.');
            } else {
                throw new Error('L\'ID du canal n\'est pas défini dans les variables d\'environnement.');
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message dans le canal Discord:', error);
        }
    })
}