import { z } from "zod";

export const createTokenSchema = z.object({
    ticker: z.string().nonempty("Please enter ticker"),
    name: z.string().nonempty("Please enter name"),
    description: z.string().nonempty("Please enter description"),
    link: z.string().url({ message: "Please enter a valid link" }),
    initialSupply: z.string().nonempty("Please enter initial supply"),
});

export type CreateTokenData = z.infer<typeof createTokenSchema>;
