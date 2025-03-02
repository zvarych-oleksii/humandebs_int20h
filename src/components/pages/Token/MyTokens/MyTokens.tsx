import Wrapper from "../../../ui/Wrapper";
import { Token } from "../../../../lib/types/token.ts";
import { BackendEvent } from "../../../../lib/types/general.ts";
import { useEffect, useState } from "react";
import { getTokenEvents } from "../../../../lib/api/api.ts";
import { useAccount } from "wagmi";
import { Card } from "../../../ui/Card/Card.tsx";
import Button from "../../../ui/Button";
import { Icons } from "../../../ui/icons/Icons.ts";

export const MyTokens = () => {
    const [tokens, setTokens] = useState<BackendEvent<Token>[]>([]);
    const { address } = useAccount();

    useEffect(() => {
        if (!address) return;
        getTokenEvents(address).then((tokens) => setTokens(tokens));
    }, [address]);

    const addTokenToMetaMask = async ({
                                          contractAddress,
                                          ticker,
                                      }: {
        contractAddress: string;
        ticker: string;
    }) => {
        try {
            const wasAdded = await window.ethereum?.request({
                method: "wallet_watchAsset",
                params: {
                    type: "ERC20",
                    options: {
                        address: contractAddress,
                        symbol: ticker,
                        decimals: 18,
                    },
                },
            });

            if (wasAdded) {
                console.log("Token added!");
            } else {
                console.log("Token addition declined.");
            }
        } catch (error) {
            console.error("Error adding token:", error);
        }
    };

    const handleAddTokenToMetaMask = async ({
                                                contractAddress,
                                                ticker,
                                            }: {
        contractAddress: string;
        ticker: string;
    }) => {
        addTokenToMetaMask({ contractAddress, ticker }).then(() =>
            alert("Token added!")
        );
    };

    return (
        <Wrapper>
            <h1 className="w-full mb-12 text-4xl font-bold text-center text-gray-200">
                My Tokens
            </h1>
            <ul className="space-y-6">
                {tokens.map((event, index) => (
                    <li key={index}>
                        <Card className="p-6 rounded-lg shadow-md transition-transform transform hover:scale-[101%]">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                    <div>
                                        <h2 className="text-2xl font-semibold text-gray-100">
                                            {event.args.name} <span className="text-lg font-normal">(${event.args.ticker})</span>
                                        </h2>
                                        <p className="mt-1 text-sm text-gray-400">
                                            {event.args.description}
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() =>
                                            handleAddTokenToMetaMask({
                                                contractAddress: event.args.contractAddress,
                                                ticker: event.args.ticker,
                                            })
                                        }
                                        className="mt-4 sm:mt-0"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Icons.metamask className="w-4 h-4" />
                                            <p>Add to MetaMask</p>
                                        </div>
                                    </Button>
                                </div>
                                <div className="border-t border-gray-400 pt-4">
                                    <p className="text-sm text-gray-300">
                                        Initial Supply / Current Supply:
                                    </p>
                                    <p className="text-base text-white font-medium">
                                        {`${(Number(event.args.initialSupply) / 10 ** 18).toFixed(3)} / ${(Number(event.args.currentBalance) / 10 ** 18).toFixed(3)}`}
                                    </p>
                                    {event.args.link && (
                                        <a
                                            href={event.args.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-2 inline-block text-blue-400 hover:text-blue-300 transition-colors"
                                        >
                                            Website
                                        </a>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </li>
                ))}
            </ul>
        </Wrapper>
    );
};
