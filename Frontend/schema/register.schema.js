import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().nonempty({ message: "Name cannot be empty" }),
  email: z.string().nonempty({ message: "Email Cannot be empty" }).email({ message: "Email is invalid" }),
  password: z.string().nonempty({ message: "Password Cannot be empty" }),
  confirmPassword: z.string().nonempty({ message: "Confirm Password Cannot be empty" }),
});
