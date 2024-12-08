import { addresses } from './addresses'

export const CHAIN_IDS = {
  NEBULA_TESTNET: '37084624',
  NEBULA_MAINNET: '1482601649'
}

export const CHAIN_IDS_NAMES = {
  [CHAIN_IDS.NEBULA_TESTNET]:'lanky-ill-funny-testnet',
  [CHAIN_IDS.NEBULA_MAINNET]: 'green-giddy-denebola'
}

const WS_RPC = {
  [CHAIN_IDS.NEBULA_TESTNET]: process.env.RPC_NEBULA_TESTNET,
  [CHAIN_IDS.NEBULA_MAINNET]: process.env.RPC_NEBULA_MAINNET
}

const JSON_RPC = {
  [CHAIN_IDS.NEBULA_TESTNET]: process.env.RPC_NEBULA_TESTNET,
  [CHAIN_IDS.NEBULA_MAINNET]: process.env.RPC_NEBULA_MAINNET
}

const getZeroExContract = (chainId: string): string => {
  const addressesForChain = addresses[chainId]
  if (!addressesForChain) {
    throw new Error(`Unknown addresses for chain ${chainId} (chain not supported)`)
  }
  const zeroExContractAddress = addressesForChain.exchange
  return zeroExContractAddress
}

const getWsRpcUrlByChainId = (chainId: string) => {
  const wsRpc = WS_RPC[chainId.trim().toString()]
  if (!wsRpc) {
    throw new Error(`Unknown WS RPC URL for chain ${chainId} (chain not supported)`)
  }
  return wsRpc
}

const getJsonRpcUrlByChainId = (chainId: string) => {
  const jsonRpc = JSON_RPC[chainId.trim().toString()]
  if (!jsonRpc) {
    throw new Error(`Unknown Json RPC URL for chain ${chainId} (chain not supported)`)
  }
  return jsonRpc
}

export { getWsRpcUrlByChainId, getZeroExContract, getJsonRpcUrlByChainId, WS_RPC, JSON_RPC }
