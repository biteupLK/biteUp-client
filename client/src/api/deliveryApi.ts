// deliveryApi.ts
import axios from "axios";
import { z } from "zod";

// Zod schema for Delivery
export const DeliverySchema = z.object({
  id: z.string().optional(),
  deliveryName: z.string(),
  email: z.string().email(),
  age: z.string(),
  vehicleNumber: z.string(),
  vehicleType: z.string(),
  contactNumber: z.string(),
});

export type DeliverySchema = z.infer<typeof DeliverySchema>;

// Response type
export type DeliveryResponse = {
  message?: string;
  error?: string;
  data?: DeliverySchema;
};

const API_BASE_URL = "/api/delivery";

// Helper function for error handling
const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      throw new Error(error.response.data.error || error.response.data.message || "API request failed");
    } else {
      throw new Error("Network error - could not connect to the server");
    }
  }
  throw new Error("An unexpected error occurred");
};

// All API functions
export async function fetchAllDeliveries(): Promise<DeliverySchema[]> {
  try {
    const res = await axios.get<DeliverySchema[]>(API_BASE_URL);
    return res.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function fetchDeliveryByEmail(email: string): Promise<DeliverySchema> {
  try {
    const res = await axios.get<DeliverySchema>(`${API_BASE_URL}/${email}`);
    return res.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function createDelivery(data: DeliverySchema): Promise<DeliveryResponse> {
  try {
    const res = await axios.post<DeliveryResponse>(`${API_BASE_URL}/create`, data);
    return res.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function updateDelivery(email: string, data: DeliverySchema): Promise<DeliveryResponse> {
  try {
    const res = await axios.put<DeliveryResponse>(`${API_BASE_URL}/${email}`, data);
    return res.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function deleteDelivery(email: string): Promise<{ message: string }> {
  try {
    const res = await axios.delete<{ message: string }>(`${API_BASE_URL}/delete/${email}`);
    return res.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function checkDeliveryEmail(email: string): Promise<boolean> {
  try {
    const res = await axios.get<boolean>(`${API_BASE_URL}/checkDelivery/${email}`);
    return res.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

// Utility function to validate delivery data
export function validateDeliveryData(data: unknown): DeliverySchema {
  try {
    return DeliverySchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      throw new Error(`Validation failed: ${errorMessages}`);
    }
    throw new Error("Unknown validation error");
  }
}

// Optionally export all functions as an object if you prefer that style
export const deliveryApi = {
  fetchAllDeliveries,
  fetchDeliveryByEmail,
  createDelivery,
  updateDelivery,
  deleteDelivery,
  checkDeliveryEmail,
  validateDeliveryData
};