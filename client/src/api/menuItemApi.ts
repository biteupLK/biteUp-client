import { z } from "zod";
import axios from "axios";
import { StorageFileSchema } from "../utils/StorageFiles.utils";

const menuItemSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.string(),
  restaurentId: z.string(),
  restaurantEmail: z.string(),
  image: z.array(z.union([z.instanceof(File), StorageFileSchema])).optional(),
});

export type MenuItem = z.infer<typeof menuItemSchema>;

export const addMenuItems = async (menuItem: MenuItem) => {
  const formData = new FormData();

  const productData = {
    name: menuItem.name,
    description: menuItem.description,
    price: Number(menuItem.price),
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
