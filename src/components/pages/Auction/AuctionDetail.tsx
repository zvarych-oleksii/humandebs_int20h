import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Wrapper from "../../ui/Wrapper";
import { getDutchAuction, getEnglishAuction } from "../../../lib/api/api";
import { DutchAuction, EnglishAuction } from "../../../lib/types/auction.ts";
import { EnglishAuctionDetail } from "../../common/Auction/EnglishAuction.tsx";
import { DutchAuctionDetail } from "../../common/Auction/DutchAuction.tsx";

export const AuctionDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { state } = useLocation();
    const auctionType = state?.type;
    const [auction, setAuction] = useState<EnglishAuction | DutchAuction | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const fetchAuction = async () => {
        if (!id) return;
        try {
            if (auctionType === 0) {
                const data = await getEnglishAuction(id);
                setAuction(data);
            } else if (auctionType === 3) {
                const data = await getDutchAuction(id);
                setAuction(data);
            }
            setLoading(false);
        } catch (err) {
            console.error("Error fetching auction:", err);
            setError("Error loading auction");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAuction();
    }, [id, auctionType]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchAuction();
        }, 5000);

        return () => clearInterval(intervalId);
    }, [id, auctionType]);


    if (loading) {
        return (
            <Wrapper>
                <div className="text-center text-xl text-gray-200">Loading auction...</div>
            </Wrapper>
        );
    }

    if (error) {
        return (
            <Wrapper>
                <div className="text-center text-xl text-red-500">{error}</div>
            </Wrapper>
        );
    }

    if (!auction) {
        return (
            <Wrapper>
                <div className="text-center text-xl text-gray-200">Auction not found</div>
            </Wrapper>
        );
    }

    if (auctionType === 0) {
        return <EnglishAuctionDetail auction={auction as EnglishAuction} />;
    } else if (auctionType === 3) {
        return <DutchAuctionDetail auction={auction as DutchAuction} />;
    }

    return null;
};
