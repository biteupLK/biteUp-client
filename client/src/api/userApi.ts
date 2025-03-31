import axios from "axios";
import { z } from "zod"

export const UserSchema = z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    mobile: z.number(),
    address: z.string(),
});

export type UserSchema = z.infer<typeof UserSchema>;

export async function profileSave({
    firstName,
    lastName,
    mobile,
    address,
    email,
}: {
    firstName: string;
    lastName: string;
    mobile: number;
    address: string;
    email: string;
}) {
    const res = await axios.post("/api/user/register", {
        firstName,
        email,
        lastName,
        mobile,
        address,

    });
    return res.data;
}

export async function profileUpdate({
    firstName,
    lastName,
    mobile,
    address,
    email,
}: {
    firstName: string;
    lastName: string;
    mobile: number;
    address: string;
    email: string;
}) {
    const res = await axios.put(`/api/user/${email}`, {
        firstName,
        email,
        lastName,
        mobile,
        address,

    });
    return res.data;
}

export async function fetchUserByEmail(email: any) {
    const res = await axios.get(`/api/user/${email}`);
    return res.data;
}