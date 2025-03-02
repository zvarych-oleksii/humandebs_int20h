export const abi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "tokenAddress",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenAmount",
                "type": "uint256"
            },
            {
                "internalType": "enum AuctionTypes",
                "name": "auctionType",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "_startPrice",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_discountRate",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_discountTimePeriod",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_duration",
                "type": "uint256"
            }
        ],
        "name": "createAuction",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "ticker",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "link",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "initialSupply",
                "type": "uint256"
            }
        ],
        "name": "createToken",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "tokenOwners",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "bid",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "endAuction",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdraw",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "pendingReturns",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getPrice",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "placeBid",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTimeLeft",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdrawReward",
        "outputs": [
            {
"internalType": "bool",
    "name": "",
    "type": "bool"
}
],
"stateMutability": "payable",
    "type": "function"
},
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": false,
        "internalType": "enum AuctionTypes",
        "name": "auctionType",
        "type": "uint8"
    },
    {
        "indexed": false,
        "internalType": "address",
        "name": "owner",
        "type": "address"
    },
    {
        "indexed": false,
        "internalType": "address",
        "name": "tokenAddress",
        "type": "address"
    },
    {
        "indexed": false,
        "internalType": "uint256",
        "name": "tokenAmount",
        "type": "uint256"
    },
    {
        "indexed": false,
        "internalType": "address",
        "name": "auctionAddress",
        "type": "address"
    }
],
    "name": "AuctionCreated",
    "type": "event"
},
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": false,
        "internalType": "address",
        "name": "winner",
        "type": "address"
    },
    {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
    }
],
    "name": "AuctionEnded",
    "type": "event"
},
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": false,
        "internalType": "address",
        "name": "bidder",
        "type": "address"
    },
    {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
    }
],
    "name": "HighestBidIncreased",
    "type": "event"
},
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": false,
        "internalType": "string",
        "name": "ticker",
        "type": "string"
    },
    {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
    },
    {
        "indexed": false,
        "internalType": "string",
        "name": "description",
        "type": "string"
    },
    {
        "indexed": false,
        "internalType": "string",
        "name": "link",
        "type": "string"
    },
    {
        "indexed": false,
        "internalType": "uint256",
        "name": "initialSupply",
        "type": "uint256"
    },
    {
        "indexed": false,
        "internalType": "address",
        "name": "owner",
        "type": "address"
    },
    {
        "indexed": false,
        "internalType": "address",
        "name": "contractAddress",
        "type": "address"
    }
],
    "name": "TokenCreated",
    "type": "event"
}
] as const;
