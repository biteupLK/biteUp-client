import { z } from "zod";
import axios from "axios";
import { StorageFileSchema } from "../utils/StorageFiles.utils";

const CartSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  signedUrl: z.string(),
  restaurentId: z.string(),
  restaurantEmail: z.string(),
  email: z.string(),
  quantity: z.number(),
  image: z.array(z.union([z.instanceof(File), StorageFileSchema])).optional(),
});

export type Cart = z.infer<typeof CartSchema>;

export async function addToCart(data: Cart) {
  const res = await axios.post(`/api/cart`, data);
  return res.data;
}

export async function fetchCartItems(email: String) {
  const res = await axios.get(`/api/cart/${email}`);
  return res.data;
}

export async function deleteCartItems(id: String) {
  const res = await axios.delete(`/api/cart/${id}`);
  return res.data;
}
