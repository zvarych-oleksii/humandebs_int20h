// Dashboard.tsx
import { useEffect, useState } from "react";
import Wrapper from "../../ui/Wrapper";
import { BackendEvent } from "../../../lib/types/general.ts";
import { Auction } from "../../../lib/types/auction.ts";
import { getAuctionEvents } from "../../../lib/api/api.ts";
import {AuctionList} from "../../common/Auction/AuctionList.tsx";

export const Dashboard = () => {
    const [auctions, setAuctions] = useState<BackendEvent<Auction>[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchAuctions = async () => {
        try {
            const events = await getAuctionEvents();
            setAuctions(events);
        } catch (error) {
            console.error("Error fetching auctions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAuctions();
    }, []);


    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchAuctions();
        }, 600);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <Wrapper>
            <div className="p-8">
                <div className="mb-10">
                    <h1 className="text-4xl font-extrabold text-center text-white drop-shadow-lg">
                        Auctions Dashboard
                    </h1>
                    <p className="mt-3 text-center text-gray-300">
                        Explore active auctions and view their details.
                    </p>
                </div>

                {loading ? (
                    <div className="text-center text-xl text-gray-200">Loading auctions...</div>
                ) : auctions.length === 0 ? (
                    <div className="text-center text-xl text-gray-200">No auctions found.</div>
                ) : (
                    <AuctionList auctions={auctions} />
                )}
            </div>
        </Wrapper>
    );
};
