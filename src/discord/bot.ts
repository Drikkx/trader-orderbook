import { Client, GatewayIntentBits } from 'discord.js';
import * as dotenv from "dotenv";
import { ServiceNamesLogLabel, getLoggerForService } from "../logger";

export const discordBotLogger = getLoggerForService(ServiceNamesLogLabel['discord-bot']);

export function startBot() {
    dotenv.config({ path: '.env' });

    const bot = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.GuildModeration,
            GatewayIntentBits.GuildMessageReactions
        ],
    })

    const token = process.env.DISCORD_TOKEN

    bot.login(token)

    console.log('Bot Ready')
}