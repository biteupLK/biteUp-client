import axios from "axios";
import { z } from "zod"

export const UserSchema = z.object({
    id: z.string(),
    foodName: z.string(),
    amount: z.number(),
    currency: z.string(),
});

export async function createPayment(data: any) {
    const res = await axios.post("/api/payment/create-checkout-session", data);
    return res.data;
}