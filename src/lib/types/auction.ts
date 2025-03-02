export interface Auction {
    auctionType: number;
    owner: string;
    tokenAddress: string;
    auctionAddress: string;
    tokenAmount: bigint;
    ended: boolean;
    token: {
        currentBalance: bigint;
        ticker: string;
        name: string;
        description: string;
        link: string;
        initialSupply: bigint;
        owner: string;
    };
}
export interface Bid {
    bidder: string;
    amount: bigint;
    transactionHash: string;
    blockNumber: number;
}

export interface AuctionEndedEvent {
    winner: string;
    amount: string;
    transactionHash: string;
    blockNumber: number;
}

export interface PendingReturn {
    address: string;
    amount: string;
}

export interface EnglishAuction {
    details: AuctionDetails;
    tokenInfo: TokenInfo;
    bidHistory: Bid[];
    auctionEndedEvent?: AuctionEndedEvent;
    pendingReturns?: PendingReturn[];
}

export interface AuctionDetails {
    winnerGetPrise: boolean;
    address: string;
    ended: boolean;
    highestBid: string; // Consider converting to bigint if needed
    highestBidder: string;
    owner: string;
    rewardToken: string;
    rewardAmount: string; // Consider converting to bigint if needed
}

export interface TokenInfo {
    ticker: string;
    name: string;
    description: string;
    link: string;
    initialSupply: string; // Consider converting to bigint if needed
    owner: string;
}

export interface DutchAuction {
    details: {
        address: string;
        ended: boolean;
        highestBid: string;
        highestBidder: string;
        owner: string;
        rewardToken: string;
        rewardAmount: string;
        currentPrice: string;
        timeLeft: string;
        winnerGetPrise: boolean;
    };
    auctionEndedEvent: any;
    tokenInfo: {
        ticker: string;
        name: string;
        description: string;
        link: string;
        initialSupply: string;
        owner: string;
    };
    pendingReturns: Array<{ address: string; amount: string }>;
}

