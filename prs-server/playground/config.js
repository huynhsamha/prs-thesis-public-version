module.exports = {
  eth: {
    network: process.env.ETH_NETWORK || 'testnet' || 'local',
    // apiKey: process.env.INFURA_API_KEY || 'your infura api key',
    // apiSecret: process.env.INFURA_API_SECRET || 'your infura api secret',
    provider: process.env.INFURA_PROVIDER || 'https://ropsten.infura.io/v3/0b65***97ac',
    // ropstenAddress: process.env.ROPSTEN_ADDRESS || '0x97f***C4b4',
    ropstenPrivateKey: process.env.ROPSTEN_PRIVATE_KEY || '95A0***C6A6E',
    // ropstenAddress2: '0x9338063cd5c8f069334925345FaDc94a8E45742f',
    ropstenPrivateKey2: 'B2EA***B8EF'
  }
};
