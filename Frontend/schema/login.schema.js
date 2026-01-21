import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .nonempty({ message: "Email is Required" })
    .email({ message: "Email should be valid" }),
  password: z.string().nonempty({ message: "Password Cannot be null" }),
});
