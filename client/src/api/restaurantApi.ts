import axios from "axios";
import { z } from "zod";
import { StorageFile, StorageFileSchema } from "../utils/StorageFiles.utils";

export const RestaurantSchema = z.object({
  id: z.string(),
  restaurantName: z.string(),
  adress: z.string(), // Note: Duplicate of 'address'? You might want to remove one
  quantity: z.string(),
  name: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  phoneNumber: z.string(),
  email: z.string().email(),
  description: z.string(),
  image: z.array(z.union([z.instanceof(File), z.custom<StorageFile>()])).optional(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  placeId: z.string().nullable(),
  logo: z.union([z.instanceof(File), z.string()]).optional(), // Correct way to add optional logo
});

export type RestaurantSchema = z.infer<typeof RestaurantSchema>;

export async function fetchRestaurantData() {
  const res = await axios.get("/api/restaurant");
  return res.data;
}

export async function fetchRestaurantByEmail(email: String) {
  const res = await axios.get(`/api/restaurant/${email}`);
  return res.data;
}

export async function addRestaurant(data: RestaurantSchema) {
  const formData = new FormData();

  const restaurantData = {
    restaurantName: data.restaurantName,
    adress: data.adress,
    name: data.name,
    address: data.address || "",
    city: data.city,
    state: data.state,
    zipCode: data.zipCode,
    phoneNumber: data.phoneNumber,
    email: data.email,
    description: data.description,
    latitude: data.latitude,
    longitude: data.longitude,
    placeId: data.placeId,
  };
  formData.append("restaurant", JSON.stringify(restaurantData));

  if (data.image && data.image.length > 0) {
    const file = data.image[0];
    if (file instanceof File) {
      formData.append("image", file);
    }
  }

  const res = await axios.post("/api/restaurant/create", formData);
  return res.data;
}

//resturant email exists
export async function checkRestaurantEmail(email: string) {
  const res = await axios.get(`/api/restaurant/checkRestaurant/${email}`);
  return res.data;
}

export async function getRestaurantImg(email: string) {
  const res = await axios.get(`/api/restaurant/getSignedUrl/${email}`); 
  return res.data.signedUrl; 
}

export async function updateRestaurant(
  email: string,
  data: RestaurantSchema,
  image?: File 
) {
  const formData = new FormData();

  const restaurantData = {
    restaurantName: data.restaurantName,
    adress: data.adress,
    name: data.name,
    address: data.address || "",
    city: data.city,
    state: data.state,
    zipCode: data.zipCode,
    phoneNumber: data.phoneNumber,
    email: data.email,
    description: data.description,
    latitude: data.latitude,
    longitude: data.longitude,
    placeId: data.placeId,
    
  };
  
  formData.append("restaurant", JSON.stringify(restaurantData));

  if (image instanceof File) {
    formData.append("image", image);
  }

  const res = await axios.put(`/api/restaurant/${email}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}

export async function deleteRestaurant(email: string) {
  try {
    const res = await axios.delete(`/api/restaurant/${email}`);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("Restaurant not found.");
      }
      throw new Error(error.response?.data || "Failed to delete restaurant.");
    }
    throw new Error("An unexpected error occurred.");
  }
}