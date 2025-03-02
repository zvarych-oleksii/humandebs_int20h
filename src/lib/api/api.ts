import axios, { AxiosInstance } from 'axios';
import {apiUrl} from "../../config.ts";
import {Token} from "../types/token.ts";
import {BackendEvent} from "../types/general.ts";
import {Auction, DutchAuction, EnglishAuction} from '../types/auction.ts';

const apiClient: AxiosInstance = axios.create({
    baseURL: apiUrl,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getRequest = async <T>(endpoint: string): Promise<T> => {
    try {
        const response = await apiClient.get<T>(endpoint);
        return response.data;
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        throw error;
    }
};

export const getTokenEvents = async (userId: string): Promise<BackendEvent<Token>[]> => {
    return getRequest<BackendEvent<Token>[]>(`/tokens/${userId}`);
};

export const getAuctionEvents = async (wallet_address?: string): Promise<BackendEvent<Auction>[]> => {
    return getRequest<BackendEvent<Auction>[]>(
        `/auctions${wallet_address ? `?wallet_address=${wallet_address}` : ''}`
    );
};


export const getEnglishAuction = async (auction_address: string): Promise<EnglishAuction> => {
    return getRequest<EnglishAuction>(
        `/english_auction_details/${auction_address}`
    );
};

export const getDutchAuction = async (auction_address: string): Promise<DutchAuction> => {
    return getRequest<DutchAuction>(
        `/dutch_auction_details/${auction_address}`
    );
};
