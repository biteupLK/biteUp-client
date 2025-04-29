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

export const addMenuItems = async (menuItem: MenuItem) => {
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

export async function getMenuItems() {
  const res = await axios.get("/api/product");
  return res.data;
}

// export async function addToCart(data: MenuItem) {
//   const res = await axios.post(`/api/cart`, data);
//   return res.data;
// }
