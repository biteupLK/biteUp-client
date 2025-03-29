import axios from "axios";
import { z } from "zod"

export const RestaurantSchema = z.object({
    id: z.string(),
    restaurantName: z.string(),
    adress: z.string(),
    quantity: z.string(),
});

export type RestaurantSchema = z.infer<typeof RestaurantSchema>;

export async function fetchRestaurantData() {
    const res = await axios.get("/api/restaurant");
    return res.data;
}

