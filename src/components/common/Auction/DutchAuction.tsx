import { useState } from "react";
import { ethers } from "ethers";
import { useWriteContract } from "wagmi";
import { useAccount } from "wagmi";

import { Card } from "../../ui/Card/Card";
import Wrapper from "../../ui/Wrapper";
import { abi } from "../../../abi.ts";
import Confetti from "react-confetti";
import { DutchAuction } from "../../../lib/types/auction.ts";
import {erc20Abi} from "viem";
import {contractAddress} from "../../../config.ts";

export const DutchAuctionDetail = ({ auction }: { auction: DutchAuction }) => {
    const { address } = useAccount();
    const [showConfetti, setShowConfetti] = useState(false);

    const { writeContract, status } = useWriteContract();
    const { writeContract: writeEndAuction, status: endAuctionStatus } = useWriteContract();


    const onGetReward = async () => {
        const amountInWei = BigInt(auction?.details?.rewardAmount || 0) * BigInt(10 ** 18);

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(auction?.details?.rewardToken || '', erc20Abi, signer);
        const tx = await tokenContract.approve(contractAddress, amountInWei);
        await tx.wait();
        console.log("Token approved!");

        writeContract({
            address: auction!.details.address as `0x${string}`,
            abi,
            functionName: "withdrawReward",
            args: [],
            chainId: 31337,
        });
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 10000);
    };
    const onBuyNow = async () => {
        try {
            // Execute the purchase
            await writeContract({
                address: auction.details.address as `0x${string}`,
                abi,
                functionName: "placeBid",
                args: [],
                chainId: 31337,
                value: auction.details.currentPrice as unknown as bigint,
            });
            // Update state after purchase
        } catch (error) {
            console.error("Error during purchase:", error);
        }
    };

    // Create a new function for getting tokens after purchase
    const onGetTokens = async () => {
        try {
            await writeContract({
                address: auction.details.address as `0x${string}`,
                abi,
                functionName: "withdraw", // or the appropriate function for claiming tokens
                args: [],
                chainId: 31337,
            });
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 10000);
        } catch (error) {
            console.error("Error claiming tokens:", error);
        }
    };

    const onEndAuction = async () => {
        if (!auction) return;
        const confirmed = window.confirm(
            "Are you sure you want to end the auction? This action cannot be undone."
        );
        if (!confirmed) return;
        try {
            await writeEndAuction({
                address: auction.details.address as `0x${string}`,
                abi,
                functionName: "endAuction",
                args: [],
                chainId: 31337,
            });
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 10000);
        } catch (error) {
            console.error("Error ending auction:", error);
        }
    };

    return (
        <Wrapper>
            <div className="flex gap-5 items-start justify-between flex-col md:flex-row">
                <div className="flex-grow w-full">
                    {address &&
                        auction &&
                        auction.details.owner.toLowerCase() === address.toLowerCase() && (
                            <Card className="p-6 flex items-center justify-between">
                                <h2 className="text-2xl font-semibold text-white mb-4">
                                    Owner Actions
                                </h2>
                                {!auction.details.ended && (
                                    <button
                                        onClick={onEndAuction}
                                        className="p-2 bg-red-500 text-white rounded"
                                    >
                                        End Auction
                                    </button>
                                )}
                                {auction.details.ended && auction.pendingReturns.length > 0 && (
                                    <button
                                        onClick={onGetTokens}
                                        className="p-2 bg-blue-500 text-white rounded"
                                    >
                                        Get Reward
                                    </button>
                                )}
                                {endAuctionStatus === "pending" && (
                                    <p className="text-gray-200">Ending auction...</p>
                                )}
                                {endAuctionStatus === "success" && (
                                    <p className="text-green-400">
                                        Auction ended successfully!
                                    </p>
                                )}
                                {endAuctionStatus === "error" && (
                                    <p className="text-red-400">
                                        Error ending auction. Please try again.
                                    </p>
                                )}
                            </Card>
                        )}

                    {/* Left Card: Auction & Token Information */}
                    <Card className="relative flex-grow h-full p-6">
                        <div className="absolute top-4 right-4">
                            <span
                                className={`px-2 py-1 text-xs font-medium rounded ${
                                    auction.details.ended ? "bg-red-500" : "bg-green-500"
                                } text-white`}
                            >
                                {auction.details.ended ? "Ended" : "Active"}
                            </span>
                        </div>
                        <h2 className="text-2xl font-semibold text-white mb-4">
                            Auction & Token Information
                        </h2>
                        {/* Auction Details Section */}
                        <div>
                            <h3 className="text-xl font-medium text-gray-300 mb-2">
                                Auction Details
                            </h3>
                            <p className="text-gray-200">
                                <strong>Owner:</strong>{" "}
                                <span className="block truncate">{auction.details.owner}</span>
                            </p>
                            <p className="text-gray-200">
                                <strong>Current Price:</strong>{" "}
                                <span className="block truncate">
                                    {ethers.utils.formatEther(auction.details.currentPrice)} ETH
                                </span>
                            </p>
                            <p className="text-gray-200">
                                <strong>Time Left:</strong>{" "}
                                <span className="block truncate">
                                    {auction.details.timeLeft} seconds
                                </span>
                            </p>
                            <p className="text-gray-200">
                                <strong>Reward Token:</strong>{" "}
                                <span className="block truncate">
                                    {auction.details.rewardToken}
                                </span>
                            </p>
                            <p className="text-gray-200">
                                <strong>Reward Amount:</strong>{" "}
                                <span className="block truncate">
                                    {(Number(auction.details.rewardAmount) / 1e18).toFixed(2)}
                                </span>
                            </p>
                        </div>
                        <div className="border-t border-gray-600 my-6"></div>
                        {/* Token Details Section */}
                        <div>
                            <h3 className="text-xl font-medium text-gray-300 mb-2">
                                Token Details
                            </h3>
                            <p className="text-white text-3xl font-bold mb-4">
                                {`${auction.tokenInfo.name} ($${auction.tokenInfo.ticker})`}
                            </p>
                            <p className="text-gray-200">
                                <span className="block truncate">
                                    {auction.tokenInfo.description}
                                </span>
                            </p>
                            <div className="mt-4">
                                <a
                                    href={auction.tokenInfo.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block px-4 py-2 bg-white/30 text-white font-semibold rounded hover:bg-white/50 transition-colors shadow"
                                >
                                    Visit Website
                                </a>
                            </div>
                            <p className="text-gray-200 mt-4">
                                <strong>Initial Supply:</strong>{" "}
                                <span className="block truncate">
                                    {(Number(auction.tokenInfo.initialSupply) / 1e18).toFixed(2)}
                                </span>
                            </p>
                            <p className="text-gray-200">
                                <strong>Token Owner:</strong>{" "}
                                <span className="block truncate">{auction.tokenInfo.owner}</span>
                            </p>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Purchase Functionality */}
                <div className="flex gap-5 flex-col md:w-1/2">
                    {!auction.details.ended && !auction.details.winnerGetPrise ? (
                        <Card className="p-6">
                            {auction.details.highestBidder === address ? (
                                <>
                                    <h2 className="text-2xl font-semibold text-white mb-4">
                                        Get Tokens
                                    </h2>
                                    <p className="text-gray-200 mb-4">
                                        You have successfully purchased the token. Click below to claim your tokens.
                                    </p>
                                    <button
                                        onClick={onGetReward}
                                        className="p-2 bg-green-500 text-white rounded"
                                    >
                                        Get Tokens
                                    </button>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-2xl font-semibold text-white mb-4">
                                        Buy Now
                                    </h2>
                                    <p className="text-gray-200 mb-4">
                                        The current price is{" "}
                                        <strong>{ethers.utils.formatEther(auction.details.currentPrice)} ETH</strong>.
                                    </p>
                                    <button
                                        onClick={onBuyNow}
                                        className="p-2 bg-blue-500 text-white rounded"
                                    >
                                        Buy Now
                                    </button>
                                    {status === "pending" && (
                                        <p className="text-gray-200">Processing purchase...</p>
                                    )}
                                    {status === "success" && (
                                        <p className="text-green-400">Purchase successful!</p>
                                    )}
                                    {status === "error" && (
                                        <p className="text-red-400">Error during purchase. Please try again.</p>
                                    )}
                                </>
                            )}
                        </Card>
                    ) : (
                        <Card className="p-6">
                            <h2 className="text-2xl font-semibold text-white mb-4">
                                Auction Ended
                            </h2>
                            <p className="text-gray-200">
                                The auction has ended. Please check back later.
                            </p>
                        </Card>
                    )}
                </div>
            </div>
            {showConfetti && <Confetti />}
        </Wrapper>
    );
};
;
