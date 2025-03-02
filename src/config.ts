export const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS
export const contractTokenAddress = import.meta.env.VITE_CONTRACT_TOKEN_ADDRESS
export const apiUrl = import.meta.env.VITE_API_URL
if (!contractAddress) {
    throw new Error("No contract address provided")
}
if (!contractTokenAddress) {
    throw new Error("No contract address provided")
}
if (!apiUrl) {
    throw new Error("No api url provided")
}
