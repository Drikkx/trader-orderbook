import { startBot } from './discord/bot';
import { startApi } from './services/api-web/startApi';

async function main() {
    startApi();
    startBot();
}

main();