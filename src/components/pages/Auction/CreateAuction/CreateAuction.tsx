import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Wrapper from "../../../ui/Wrapper";
import FormField from "../../../ui/FormField";
import { CreateAuctionData, createAuctionSchema } from "../../../../common/schemas/createAuction";
import { Input, Select } from "../../../ui/inputs";
import Button from "../../../ui/Button";
import { useAccount, useWriteContract } from "wagmi";
import { contractAddress } from "../../../../config.ts";
import { abi } from "../../../../abi.ts";
import { contractFunctions } from "../../../../common/enums/contractFunctions.ts";
import { useNavigate } from "react-router-dom";
import { navigation } from "../../../../common/enums/navigation.ts";
import { BackendEvent } from "../../../../lib/types/general.ts";
import { Token } from "../../../../lib/types/token.ts";
import { getTokenEvents } from "../../../../lib/api/api.ts";
import { erc20Abi } from "viem";
import { useWatch } from "react-hook-form";

export const CreateAuction = () => {
    const { isConnected, address } = useAccount();
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<CreateAuctionData>({
        resolver: zodResolver(createAuctionSchema),
    });
    const [formData, setFormData] = useState<CreateAuctionData | null>(null);
    const navigate = useNavigate();
    const { data, writeContract, status } = useWriteContract();
    const [tokens, setTokens] = useState<BackendEvent<Token>[]>([]);
    const [approving, setApproving] = useState(false);

    const auctionType = useWatch({ control, name: "auctionType" });

    useEffect(() => {
        if (!address) return;
        getTokenEvents(address).then(setTokens);
    }, [address]);

    useEffect(() => {
        if (status === "success" && data && formData) {
            navigate(navigation.myAuctions);
        } else if (status === "error") {
            alert("Something went wrong :(");
        }
    }, [status, data, navigate, formData]);

    const approveAndCreateAuction = async (data: CreateAuctionData) => {
        if (!isConnected || !window.ethereum) {
            alert("Please log in with MetaMask!");
            return;
        }

        setFormData(data);
        const { tokenAddress, tokenAmount, auctionType: aType } = data;
        const amountInWei = BigInt(tokenAmount) * BigInt(10 ** 18);

        // За умовою, якщо аукціон англійський, додаткові поля мають бути 0
        let startPrice = BigInt(0);
        let discountRate = BigInt(0);
        let discountTimePeriod = BigInt(0);
        let duration = BigInt(0);

        if (aType === "3") {
            startPrice = BigInt(Number(data._startPrice!) * 10 ** 18);
            discountRate = BigInt(Number(data._discountRate!) * 10**18);
            discountTimePeriod = BigInt(data._discountTimePeriod!);
            duration = BigInt(data._duration!);
        }

        try {
            setApproving(true);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, signer);

            const tx = await tokenContract.approve(contractAddress, amountInWei);
            await tx.wait();

            setApproving(false);

            writeContract({
                address: contractAddress,
                abi,
                functionName: contractFunctions.createAuction,
                args: [
                    tokenAddress as `0x${string}`,
                    amountInWei,
                    Number(aType),
                    startPrice,
                    discountRate,
                    discountTimePeriod,
                    duration,
                ],
                chainId: 31337,
            });
        } catch (error) {
            console.error("Approval failed:", error);
            setApproving(false);
            alert("Token approval failed. Please try again.");
        }
    };

    return (
        <Wrapper>
            <div className="flex flex-col items-center justify-center w-full max-w-[600px] mx-auto">
                <h1 className="w-full mb-12 text-4xl font-bold text-center text-gray-200">
                    Create Auction
                </h1>
                <form onSubmit={handleSubmit(approveAndCreateAuction)} className="w-full">
                    <FormField label="Select Token" error={errors.tokenAddress?.message}>
                        <Select {...register("tokenAddress")} error={errors.tokenAddress?.message}>
                            <option value="">Select a token</option>
                            {tokens.length > 0 ? (
                                tokens.map((token) => (
                                    <option key={token.args.contractAddress} value={token.args.contractAddress}>
                                        {token.args.name} (${token.args.ticker})
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>No tokens available</option>
                            )}
                        </Select>
                    </FormField>

                    <FormField label="Token Amount" error={errors.tokenAmount?.message}>
                        <Input
                            {...register("tokenAmount")}
                            type="number"
                            placeholder="Enter amount of tokens"
                            error={errors.tokenAmount?.message}
                        />
                    </FormField>

                    <FormField label="Auction Type" error={errors.auctionType?.message}>
                        <Select {...register("auctionType")} error={errors.auctionType?.message}>
                            <option value="">Select Auction Type</option>
                            <option value="0">English Auction</option>
                            <option value="3">Dutch Auction</option>
                        </Select>
                    </FormField>

                    {auctionType === "3" && (
                        <>
                            <FormField label="Start Price" error={errors._startPrice?.message}>
                                <Input
                                    {...register("_startPrice")}
                                    placeholder="Enter start price"
                                    error={errors._startPrice?.message}
                                />
                            </FormField>
                            <FormField label="Discount Rate" error={errors._discountRate?.message}>
                                <Input
                                    {...register("_discountRate")}
                                    placeholder="Enter discount rate"
                                    error={errors._discountRate?.message}
                                />
                            </FormField>
                            <FormField label="Discount Time Period" error={errors._discountTimePeriod?.message}>
                                <Input
                                    {...register("_discountTimePeriod")}
                                    placeholder="Enter discount time period"
                                    error={errors._discountTimePeriod?.message}
                                />
                            </FormField>
                            <FormField label="Duration" error={errors._duration?.message}>
                                <Input
                                    {...register("_duration")}
                                    placeholder="Enter duration"
                                    error={errors._duration?.message}
                                />
                            </FormField>
                        </>
                    )}

                    <Button type="submit" className="w-full py-3" disabled={isSubmitting || approving}>
                        {approving ? "Approving..." : status === "pending" ? "Creating Auction..." : "Create Auction"}
                    </Button>
                </form>
            </div>
        </Wrapper>
    );
};

export default CreateAuction;
