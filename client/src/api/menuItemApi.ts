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

  formData.append("name", menuItem.name);
  formData.append("description", menuItem.description);
  formData.append("price", menuItem.price);
  formData.append("restaurantEmail", menuItem.restaurantEmail || "");

  if (menuItem.image && menuItem.image.length > 0) {
    const file = menuItem.image[0];
    if (file instanceof File) {
      formData.append("image", file);
    }
  }

  const res = await axios.post("/api/menu", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};
