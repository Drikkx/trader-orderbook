
# Orderbook API
## Description
This project is an API for managing an order book. It uses TypeScript with Express for the backend and Prisma for database management. The project also incorporates tools to work with Ethereum smart contracts using Ethers.js.

## Installation
### Prerequisites
Node.js (v14 or higher)
npm or yarn

### Clone the Repository
```sh
git clone [Repository URL]
cd orderbook-api
```
### Install Dependencies

```sh
npm install
# or
yarn install
```
## Available Scripts
Build: Compile TypeScript to JavaScript.
```sh
npm run build
```
### Develop: 
Run the server in development mode with hot-reloading.
```sh
npm run dev
```
### Formatter: 
Format the code according to Prettier rules.
```sh
npm run prettier
```
### Type Checking: 
Check types without compiling the code.
```sh
npm run typecheck
```
### Prisma: 
Pull schema from database:

```sh
npm run prisma:pull
```
### Generate Prisma client:

```sh
npm run prisma:generate
```
### Open Prisma Studio:

```sh
npm run prisma:studio
```
### Start Discord Bot:

```sh
npm run dev-bot
```
### Run the application in production:

```sh
npm start
```
## Configuration
### Environment Variables: 
Copy .env.example to .env and fill in the necessary variables.

## Technologies Used
### Backend:
Express.js for the web server.
Prisma for ORM and database management.

### Blockchain:
Ethers.js to interact with Ethereum.

### Others:
TypeScript for static typing.
Jest for unit testing.
Prettier and TSLint for code formatting and linting.
Discord.js for Discord integration.

## License
This project is licensed under the MIT License (LICENSE).

Please adapt or complete this file according to the specifics of your project, such as adding sections on API documentation, usage examples, or security information.