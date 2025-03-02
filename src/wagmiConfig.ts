import { http, createConfig } from 'wagmi'
import { metaMask } from "wagmi/connectors"

const hardhatLocal = {
    id: 31337,
    name: "Hardhat Localhost",
    network: "hardhat",
    nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
    },
    rpcUrls: {
        default: { http: ["http://192.168.0.101:8545"] },
    },
    testnet: true,
}

// Create Wagmi Config
export const config = createConfig({
    chains: [hardhatLocal],
    connectors: [metaMask()],
    transports: {
        [hardhatLocal.id]: http("http://192.168.0.101:8545"),
    },
})
