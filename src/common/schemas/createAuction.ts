import { z } from "zod";

export const createAuctionSchema = z
    .object({
        tokenAddress: z.string().length(42, "Invalid Ethereum address"),
        tokenAmount: z.string().nonempty("Token amount must be positive"),
        auctionType: z.string().nonempty("Please select auction type"),
        _startPrice: z.string().optional(),
        _discountRate: z.string().optional(),
        _discountTimePeriod: z.string().optional(),
        _duration: z.string().optional(),
    })
    .superRefine((data, ctx) => {
        if (data.auctionType === "3") {
            if (!data._startPrice || data._startPrice.trim() === "") {
                ctx.addIssue({
                    code: "custom",
                    path: ["_startPrice"],
                    message: "Start Price is required for Dutch Auction",
                });
            }
            if (!data._discountRate || data._discountRate.trim() === "") {
                ctx.addIssue({
                    code: "custom",
                    path: ["_discountRate"],
                    message: "Discount Rate is required for Dutch Auction",
                });
            }
            if (!data._discountTimePeriod || data._discountTimePeriod.trim() === "") {
                ctx.addIssue({
                    code: "custom",
                    path: ["_discountTimePeriod"],
                    message: "Discount Time Period is required for Dutch Auction",
                });
            }
            if (!data._duration || data._duration.trim() === "") {
                ctx.addIssue({
                    code: "custom",
                    path: ["_duration"],
                    message: "Duration is required for Dutch Auction",
                });
            }
        }
    });

export type CreateAuctionData = z.infer<typeof createAuctionSchema>;
