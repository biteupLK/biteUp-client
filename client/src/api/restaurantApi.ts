import axios from "axios";
import { z } from "zod"

export const RestaurantSchema = z.object({
    id: z.string(),
    restaurantName: z.string(),
    adress: z.string(), // typo? should this be "address"?
    quantity: z.string(),
    name: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    phoneNumber: z.string(),
    email: z.string().email(),
    description: z.string(),
    logo: z.instanceof(File).nullable(),
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
    placeId: z.string().nullable(),
});


export type RestaurantSchema = z.infer<typeof RestaurantSchema>;

export async function fetchRestaurantData() {
    const res = await axios.get("/api/restaurant");
    return res.data;
}

export async function addRestaurant(data: RestaurantSchema) {
    const res = await axios.post("/api/restaurant/create", data);
    return res.data;
}

//resturant email exists
export async function checkRestaurantEmail(email: string) {
    const res = await axios.get(`/api/restaurant/checkRestaurant/${email}`);
    return res.data;
}
