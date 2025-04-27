import { z } from "zod";
import axios from "axios";

//
// Primitive wrappers
//
const objectSchema = z.object({ value: z.string().optional() });
const amountSchema = z.object({ value: z.object({ value: z.string() }) });

//
// Address
//
const addressMembers = z.object({
  city: z.object({ value: z.string() }),
  country: z.object({ value: z.string() }),
  line1: z.object({ value: z.string() }),
  line2: z.object({ value: z.string() }),
  postal_code: z.object({ value: z.string() }),
});
const addressSchema = z.object({ members: addressMembers });
export type Address = z.infer<typeof addressSchema>;

//
// Customer details
//
const customerDetailsMembers = z.object({
  address: addressSchema,
  email: z.object({ value: z.string() }),
  name: z.object({ value: z.string() }),
  tax_exempt: z.object({ value: z.string() }),
});
const customerDetailsSchema = z.object({ members: customerDetailsMembers });
export type CustomerDetails = z.infer<typeof customerDetailsSchema>;

//
// Metadata
//
const metadataMembers = z.object({
  foodName: z.object({ value: z.string() }),
  receipt_email: z.object({ value: z.string() }),
  restaurantEmail: z.object({ value: z.string() }),
  phone: z.object({ value: z.string() }),
});
const metadataSchema = z.object({ members: metadataMembers });
export type Metadata = z.infer<typeof metadataSchema>;

//
// The full “members” block that lives under data.object.members
//
const sessionMembers = z.object({
  id: z.null(),
  object: z.object({ value: z.string() }),
  billing_address_collection: objectSchema,
  cancel_url: objectSchema,
  currency: objectSchema,
  customer: objectSchema,
  payment_status: objectSchema,
  success_url: objectSchema,
  mode: objectSchema,
  amount_subtotal: amountSchema,
  amount_total: amountSchema,
  payment_intent: objectSchema,
  currencyObject: z.null(),
  metadata: metadataSchema,
  customer_details: customerDetailsSchema,
  total_details: z.object({
    amount_discount: z.null(),
    amount_shipping: z.null(),
    amount_tax: z.null(),
  }),
});

//
// Top‑level event schema
//
const checkoutEventSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  type: z.string(),
  data: z.object({
    object: z.object({
      members: sessionMembers,
    }),
  }),
});
export type CheckoutEvent = z.infer<typeof checkoutEventSchema>;

//
// Array of events
//
const checkoutEventsSchema = z.array(checkoutEventSchema);
export type CheckoutEvents = z.infer<typeof checkoutEventsSchema>;

//
// API fetcher
//
export async function fetchMyOrders(email: string) {
  const res = await axios.get<CheckoutEvents>(`/api/payment/${email}/get`);
  return res.data;
}

export async function fetchRestaurantOrders(email: string) {
  const res = await axios.get<CheckoutEvents>(`/api/payment/${email}/get-restaurant-order`);
  return res.data;
}