import { z } from "zod";
import axios from "axios";
import { StorageFileSchema } from "../utils/StorageFiles.utils";

const menuItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  price: z.number(),
  signedUrl:z.string(),
  restaurentId: z.string(),
  restaurantEmail: z.string(),
  email: z.string(),
  image: z.array(z.union([z.instanceof(File), StorageFileSchema])).optional(),
});

export type MenuItem = z.infer<typeof menuItemSchema>;

export const addMenuItems = async (menuItem: MenuItem) => {      //call add products api
  const formData = new FormData();

  const productData = {
    name: menuItem.name,
    description: menuItem.description,
    price: Number(menuItem.price),
    category: menuItem.category,
    restaurantEmail: menuItem.restaurantEmail || "",
  };
  formData.append("product", JSON.stringify(productData));

  if (menuItem.image && menuItem.image.length > 0) {
    const file = menuItem.image[0];
    if (file instanceof File) {
      formData.append("image", file);
    }
  }

  const res = await axios.post("/api/product", formData);

  return res.data;
};

export async function getMenuItems() {                             //call get all products api
  const res = await axios.get("/api/product");
  return res.data;
}

// Add this function to your existing API calls
export async function getMenuItemsByEmail(email: string) {       //call email api via get specific products
  const res = await axios.get(`/api/product/api/${email}`);
  return res.data;
}

//update route call

export async function updateMenuItem(                      //call product update api
  id: string,
  menuItem: MenuItem,
  image?: File
) {
  const formData = new FormData();

  const productData = {
    name: menuItem.name,
    description: menuItem.description,
    price: Number(menuItem.price),
    category: menuItem.category,
    restaurantEmail: menuItem.restaurantEmail || "",
  };
  
  formData.append("product", JSON.stringify(productData));

  if (image instanceof File) {
    formData.append("image", image);
  }

  const res = await axios.put(`/api/product/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}

//delete route call
export async function deleteMenuItem(id:string){            //call delete a product api
  try {
    const res=await axios.delete(`/api/product/${id}`);
  return res.data;
} catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("Product not found.");
      }
      throw new Error(error.response?.data || "Failed to delete Product.");
    }
    throw new Error("An unexpected error occurred.");
  }
}

// export async function addToCart(data: MenuItem) {
//   const res = await axios.post(`/api/cart`, data);
//   return res.data;
// }
