import { z } from "zod";
import { LANGUAGES, RESIDENCE_TYPES, ROLES } from "@/types/daak";

const phone = z.string().regex(/^\+977-9[6-8]\d{8}$/, "phone");

export const registerSchema = z
  .object({
    role: z.enum(ROLES),
    fullName: z.string().trim().min(3, "name"),
    phone,
    email: z.string().trim().email("email"),
    password: z.string().min(8, "password"),
    confirmPassword: z.string(),
    language: z.enum(LANGUAGES),
    acceptTerms: z.boolean().refine((value) => value, { message: "terms" }),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "confirm",
  });

export const loginSchema = z.object({
  phone,
  password: z.string().min(1, "credentials"),
});

export const phoneSchema = z.object({ phone });

export const detailsSchema = z.object({
  province: z.string().min(1, "required"),
  district: z.string().min(1, "required"),
  municipality: z.string().min(1, "required"),
  ward: z.number({ invalid_type_error: "required" }).int().min(1).max(40),
  areaTole: z.string().trim().min(2, "area"),
  streetName: z.string().trim(),
  houseNumber: z.string().trim().min(1, "house"),
  landmark: z.string().trim().min(2, "landmark"),
  residenceType: z.enum(RESIDENCE_TYPES),
  isFamilyShared: z.boolean(),
});

export type RegisterValues = z.infer<typeof registerSchema>;
export type LoginValues = z.infer<typeof loginSchema>;
export type DetailsValues = z.infer<typeof detailsSchema>;
