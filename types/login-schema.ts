import * as z from "zod"

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Invalid Email address" // Incase there is an error that is why we add this mesage here.
    }),
    password: z.string().min(1, {
        message: "Password is required",
    }),
    code: z.optional(z.string()), // This is for two factor authentication login code
})