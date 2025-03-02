import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import Wrapper from "../../../ui/Wrapper";
import FormField from "../../../ui/FormField";
import { CreateTokenData, createTokenSchema } from "../../../../common/schemas/createToken";
import { Input, TextArea } from "../../../ui/inputs";
import Button from "../../../ui/Button";
import {useAccount, useWriteContract} from "wagmi";
import { contractTokenAddress} from "../../../../config.ts";
import { abi } from "../../../../abi.ts";
import { contractFunctions } from "../../../../common/enums/contractFunctions.ts";
import { useNavigate } from "react-router-dom";
import { navigation } from "../../../../common/enums/navigation.ts";

export const CreateToken = () => {
    const { isConnected } = useAccount();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CreateTokenData>({
        resolver: zodResolver(createTokenSchema),
    });

    const [formData, setFormData] = useState<CreateTokenData | null>(null);
    const navigate = useNavigate();

    const { data, writeContract, status } = useWriteContract();

    useEffect(() => {
        if (status === "success" && data && formData) {
            navigate(navigation.myTokens);
        } else if (status === "error") {
            alert("Something went wrong :(");
        }
    }, [status, data, navigate, formData]);

    const onSubmit = (data: CreateTokenData) => {
        if (!isConnected) {
            alert("Please log in!");
            return;
        }
        setFormData(data);
        const { ticker, name, description, link, initialSupply } = data;
        writeContract({
            address: contractTokenAddress,
            abi,
            functionName: contractFunctions.createToken,
            args: [ticker, name, description, link, BigInt(initialSupply) * BigInt(10 ** 18)],
            chainId: 31337,
        });
    };

    return (
        <Wrapper>
            <div className="flex flex-col items-center justify-center w-full max-w-[600px] mx-auto">
                <h1 className="w-full mb-12 text-4xl font-bold text-center text-gray-200">
                    Create Token
                </h1>
                <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                    <FormField label="Ticker" error={errors.ticker?.message}>
                        <Input
                            {...register("ticker")}
                            placeholder="Enter token ticker"
                            error={errors.ticker?.message}
                        />
                    </FormField>

                    <FormField label="Token Name" error={errors.name?.message}>
                        <Input
                            {...register("name")}
                            placeholder="Enter token name"
                            error={errors.name?.message}
                        />
                    </FormField>

                    <FormField label="Website Link" error={errors.link?.message}>
                        <Input
                            {...register("link")}
                            placeholder="Enter website link"
                            error={errors.link?.message}
                        />
                    </FormField>

                    <FormField label="Initial Supply" error={errors.initialSupply?.message}>
                        <Input
                            {...register("initialSupply")}
                            type={"number"}
                            placeholder="Enter initial supply"
                            error={errors.initialSupply?.message}
                        />
                    </FormField>

                    <FormField label="Description" error={errors.description?.message}>
                        <TextArea
                            className="h-40"
                            {...register("description")}
                            error={errors.description?.message}
                        />
                    </FormField>

                    <Button type="submit" className="w-full py-3" disabled={isSubmitting}>
                        {status === "pending" ? "Creating..." : "Create Token"}
                    </Button>
                </form>
            </div>
        </Wrapper>
    );
};

export default CreateToken;
