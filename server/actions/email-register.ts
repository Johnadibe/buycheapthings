"use server"

import { RegisterSchema } from "@/types/register-schema"
import { createSafeActionClient } from "next-safe-action"
import bcrypt from "bcrypt"
import { db } from ".."
import { eq } from "drizzle-orm"
import { users } from "../schema"
import { generateEmailVerificationToken } from "./tokens"

const action = createSafeActionClient()

export const emailRegister = action(RegisterSchema, async ({ email, password, name}) => {
    // 1. Hash the password using bcryptjs
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log(hashedPassword)

    // check if we have an existing user
    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
    })

    // check if email is already in the database then say it's in use else if it's not then register the user but also send the verification (verification email, we need email address that is active not fake)
    if (existingUser) {
        if(!existingUser.emailVerified) {
             const verificationToken = await generateEmailVerificationToken(email) // we will make a token that will be sent to the email and it needs to ne saved to our database with the user that made the request.
            //  await sendVerificationEmail() // we will send a verification email using resend library

             return { success: "Email Confimation resent"}
        }
        return {error: "Email already in use"}
    }
    // Logic for when the user is not registered
    await db.insert(users).values({
        email,
        name,
        password: hashedPassword,
    })

    // Get the email verification token and send the email after the register
    const verificationToken = await generateEmailVerificationToken(email)
    // await sendVerificationEmail()

    return { success: "Confirmation Email Sent!"}
}
    
)