import { useState } from "react";
import { ethers } from "ethers";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAccount, useWriteContract } from "wagmi";

import { Card } from "../../ui/Card/Card";
import Wrapper from "../../ui/Wrapper";
import FormField from "../../ui/FormField";
import { Input } from "../../ui/inputs";
import { abi } from "../../../abi.ts";
import Confetti from "react-confetti";
import {erc20Abi} from "viem";
import {contractAddress} from "../../../config.ts";
import {EnglishAuction} from "../../../lib/types/auction.ts";

const bidSchema = z.object({
    bidAmount: z
        .string()
        .nonempty("Bid amount is required")
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
            message: "Bid amount must be a positive number",
        }),
});
type BidFormData = z.infer<typeof bidSchema>;

const truncateAddress = (address: string, length = 10) =>
    address.length > length ? `${address.substring(0, length)}...` : address;

export const EnglishAuctionDetail = ({auction}: {auction: EnglishAuction}) => {
    const {address, isConnected} = useAccount();
    const [showConfetti, setShowConfetti] = useState(false);

    const {writeContract, status} = useWriteContract();
    const {writeContract: writeEndAuction, status: endAuctionStatus} = useWriteContract();



    let userPreviousBid = 0;
    if (auction && address) {
        userPreviousBid = auction.bidHistory
            .filter((bid) => bid.bidder.toLowerCase() === address.toLowerCase())
            .reduce((acc, bid) => {
                const bidValue = Number(ethers.utils.formatEther(bid.amount));
                return Math.max(acc, bidValue);
            }, 0);
    }

    // Determine if the user has been outbid
    const currentHighestBidEther = auction ? Number(ethers.utils.formatEther(auction.details.highestBid)) : 0;
    const isUserHighestBidder =
        !!address && auction?.details.highestBidder.toLowerCase() === address.toLowerCase();

    const isOutbid =
        !!address &&
        !!auction &&
        auction.details.highestBidder.toLowerCase() !== address.toLowerCase() &&
        userPreviousBid > 0;

    // Define a small margin (in ETH) so that your bid is slightly higher than the current highest
    const margin = 0.001;
    // For the additional bid, the minimum extra amount needed is the difference plus the margin
    const minAdditional = isOutbid ? currentHighestBidEther - userPreviousBid + margin : 0;

    // Original bid form hook (for new bidders or when you're still highest)
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm<BidFormData>({
        resolver: zodResolver(bidSchema),
    });

    // Additional bid form schema (for increasing your bid when outbid)
    const additionalBidSchema = z.object({
        additionalBid: z
            .string()
            .nonempty("Additional bid amount is required")
            .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
                message: "Must be a positive number",
            })
            .refine(
                (val) => Number(val) >= minAdditional,
                {message: `Your additional bid must be at least ${minAdditional.toFixed(4)} ETH`}
            ),
    });
    type AdditionalBidFormData = z.infer<typeof additionalBidSchema>;

    const {
        register: registerAdditional,
        handleSubmit: handleSubmitAdditional,
        reset: resetAdditional,
        formState: {errors: errorsAdditional},
    } = useForm<AdditionalBidFormData>({
        resolver: zodResolver(additionalBidSchema),
    });

    // Handler for the original bid form
    const onBidSubmit = async (data: BidFormData) => {
        if (!auction) return;
        try {
            const bidValue = ethers.utils.parseEther(data.bidAmount);
            writeContract({
                address: auction.details.address as `0x${string}`,
                abi,
                functionName: "bid",
                args: [],
                chainId: 31337,
                value: bidValue as unknown as bigint,
            });
            reset();
        } catch (error) {
            console.error("Error placing bid:", error);
        }
    };

    // Handler for the additional bid form (when outbid)
    const onAdditionalBidSubmit = async (data: AdditionalBidFormData) => {
        if (!auction) return;
        try {
            const additionalBid = Number(data.additionalBid);
            const bidValue = ethers.utils.parseEther(additionalBid.toString());
            writeContract({
                address: auction.details.address as `0x${string}`,
                abi,
                functionName: "bid",
                args: [],
                chainId: 31337,
                value: bidValue as unknown as bigint,
            });
            resetAdditional();
        } catch (error) {
            console.error("Error increasing bid:", error);
        }
    };

    const onEndAuction = async () => {
        if (!auction) return;
        const confirmed = window.confirm(
            "Are you sure you want to end the auction? This action cannot be undone."
        );
        if (!confirmed) return;
        try {
            writeEndAuction({
                address: auction.details.address as `0x${string}`,
                abi,
                functionName: "endAuction",
                args: [],
                chainId: 31337,
            });
        } catch (error) {
            console.error("Error ending auction:", error);
        }
    };

    const onClaimReward = async () => {
        if (!isConnected || !window.ethereum) {
            alert("Please log in with MetaMask!");
            return;
        }


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

    const onClaimRefund = () => {
        if (!auction?.details?.address) return
        writeContract({
            address: auction.details.address as `0x${string}`,
            abi,
            functionName: "withdraw",
            chainId: 31337,
        });
    };


    const isWinner =
        auction?.auctionEndedEvent &&
        address &&
        auction.auctionEndedEvent.winner.toLowerCase() === address.toLowerCase();

    const pendingReturn = auction?.pendingReturns?.find(
        (ret) => address && ret.address.toLowerCase() === address.toLowerCase()
    );
    const refundAmount = pendingReturn ? Number(ethers.utils.formatEther(pendingReturn.amount)) : 0;

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
                                <strong>Highest Bid:</strong>{" "}
                                <span className="block truncate">
                {ethers.utils.formatEther(auction.details.highestBid)}
              </span>
                            </p>
                            <p className="text-gray-200">
                                <strong>Highest Bidder:</strong>{" "}
                                <span className="block">{auction.details.highestBidder}</span>
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
                                {`${auction.tokenInfo.name} (${auction.tokenInfo.ticker})`}
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

                {/* Right Column: Additional Functionalities */}
                <div className="flex gap-5 flex-col md:w-1/2">
                    {auction.details.ended && address && ((isWinner && !auction.details.winnerGetPrise) || refundAmount > 0) && (
                        <Card className="p-6">
                            {isWinner && !auction.details.winnerGetPrise && (
                                <>
                                    <h2 className="text-2xl font-semibold text-white mb-4">
                                        Claim Your Reward
                                    </h2>
                                    <p className="text-gray-200 mb-4">
                                        Congratulations, you have won the auction! Click the button below to claim your
                                        reward.
                                    </p>
                                    <button
                                        onClick={() => {
                                            onClaimReward()
                                        }}
                                        className="p-2 bg-green-500 text-white rounded"
                                    >
                                        Claim Reward
                                    </button>
                                </>
                            ) }{ !isWinner && refundAmount > 0 && (
                                <>
                                    <h2 className="text-2xl font-semibold text-white mb-4">
                                        Claim Your Refund
                                    </h2>
                                    <p className="text-gray-200 mb-4">
                                        You did not win the auction. Click the button below to claim your refund of{" "}
                                        <strong>{refundAmount.toFixed(4)} ETH</strong>.
                                    </p>
                                    <button
                                        onClick={() => {
                                            onClaimRefund()
                                        }}
                                        className="p-2 bg-green-500 text-white rounded"
                                    >
                                        Claim Refund
                                    </button>
                                </>
                            )}
                        </Card>
                    )} { !auction.details.ended && (
                        // Existing bid card logic if auction is not ended
                        <>
                            {userPreviousBid > 0 ? (
                                <Card className="p-6">
                                    <h2 className="text-2xl font-semibold text-white mb-4">
                                        {isOutbid ? "Increase Your Bid" : "Your bid is the highest, wait for updates"}
                                    </h2>
                                    <p className="text-gray-200 mb-4">
                                        You've previously bid{" "}
                                        <strong>{userPreviousBid.toFixed(4)} ETH</strong>.
                                        {!isUserHighestBidder && (
                                            <>
                                                {" "}
                                                To outbid the current highest bid of{" "}
                                                <strong>{currentHighestBidEther.toFixed(4)} ETH</strong>, you must add
                                                at least{" "}
                                                <strong>{minAdditional.toFixed(4)} ETH</strong>.
                                            </>
                                        )}
                                    </p>
                                    <form onSubmit={handleSubmitAdditional(onAdditionalBidSubmit)}
                                          className="flex flex-col gap-4">
                                        <FormField label="Additional Bid"
                                                   error={errorsAdditional.additionalBid?.message}>
                                            <Input
                                                disabled={isUserHighestBidder}
                                                type="text"
                                                placeholder="Enter additional bid amount in ETH"
                                                {...registerAdditional("additionalBid")}
                                            />
                                        </FormField>
                                        <button disabled={isUserHighestBidder} type="submit"
                                                className="disabled:cursor-not-allowed p-2 bg-blue-500 text-white rounded">
                                            Increase Bid
                                        </button>
                                        {status === "pending" && <p className="text-gray-200">Placing bid...</p>}
                                        {status === "success" &&
                                            <p className="text-green-400">Bid placed successfully!</p>}
                                        {status === "error" &&
                                            <p className="text-red-400">Error placing bid. Please try again.</p>}
                                    </form>
                                </Card>
                            ) : (
                                <Card className="p-6">
                                    <h2 className="text-2xl font-semibold text-white mb-4">
                                        Place a Bid
                                    </h2>
                                    <p className="text-gray-200 mb-4">
                                        Enter your bid amount (in ETH) below and submit to place your bid.
                                    </p>
                                    <form onSubmit={handleSubmit(onBidSubmit)} className="flex flex-col gap-4">
                                        <FormField label="Bid Amount" error={errors.bidAmount?.message}>
                                            <Input type="text"
                                                   placeholder="Enter bid amount in ETH" {...register("bidAmount")} />
                                        </FormField>
                                        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
                                            Place Bid
                                        </button>
                                        {status === "pending" && <p className="text-gray-200">Placing bid...</p>}
                                        {status === "success" &&
                                            <p className="text-green-400">Bid placed successfully!</p>}
                                        {status === "error" &&
                                            <p className="text-red-400">Error placing bid. Please try again.</p>}
                                    </form>
                                </Card>
                            )}
                        </>
                    )}

                    <Card className="p-6 max-h-[350px] overflow-y-scroll">
                        <h2 className="text-2xl font-semibold text-white mb-4">
                            Bid History
                        </h2>
                        <p className="text-gray-200 mb-4">
                            The bid history updates every minute.
                        </p>
                        <div className="overflow-auto">
                            <table className="min-w-full text-left text-sm text-gray-300">
                                <thead className="bg-gray-700">
                                <tr>
                                    <th className="px-4 py-2">Bidder</th>
                                    <th className="px-4 py-2">Amount (ETH)</th>
                                    <th className="px-4 py-2">Transaction</th>
                                </tr>
                                </thead>
                                <tbody>
                                {auction.bidHistory && auction.bidHistory.length > 0 ? (
                                    [...auction.bidHistory].reverse().map((bid, idx) => (
                                        <tr
                                            key={idx}
                                            className={`border-b border-gray-600 ${
                                                address &&
                                                bid.bidder.toLowerCase() === address.toLowerCase()
                                                    ? "bg-yellow-200/10"
                                                    : ""
                                            }`}
                                        >
                                            <td className="px-4 py-2">{truncateAddress(bid.bidder)}</td>
                                            <td className="px-4 py-2">
                                                {Number(ethers.utils.formatEther(bid.amount)).toFixed(4)}
                                            </td>
                                            <td className="px-4 py-2">
                                                <a
                                                    href={`https://etherscan.io/tx/${bid.transactionHash}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-400 underline"
                                                >
                                                    View Tx
                                                </a>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td className="px-4 py-2" colSpan={4}>
                                            No bids yet.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>
            {showConfetti && <Confetti/>}
        </Wrapper>
    );
}
