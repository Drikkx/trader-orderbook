export interface AddressesForChain {
  exchange: string
  wrappedNativeToken: string
}

const addresses: { [key: string]: AddressesForChain | undefined } = {
  '974399131': {
    exchange: '0x136A1b793C40B6BC64196d1BD1cEE84E99CB62F1',
    wrappedNativeToken: '0xc778417e063141139fce010982780140aa0cd5ab',
  },
  '37084624': {
    exchange: '0xF9eB389701A4f2227998058e502fF9c360689b57',
    wrappedNativeToken: '0xc778417e063141139fce010982780140aa0cd5ab',
  },
  // 1482601649
}

export { addresses }
