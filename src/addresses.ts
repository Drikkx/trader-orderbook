export interface AddressesForChain {
  exchange: string
  wrappedNativeToken: string
}

const addresses: { [key: string]: AddressesForChain | undefined } = {
  '37084624': {
    exchange: '0xb68ae56fEf0D8d457C197B1f1Ea01d276f78F76F',
    wrappedNativeToken: '0xc778417e063141139fce010982780140aa0cd5ab',
  },
  '1482601649': {
    exchange: '0x16174b94C2D6A71f66E37AC054c17Dd13c332A4e',
    wrappedNativeToken: '0xCC205196288B7A26f6D43bBD68AaA98dde97276d',
  },
}

export { addresses }
