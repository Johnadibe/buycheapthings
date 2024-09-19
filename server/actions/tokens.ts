"use server"

import { eq } from "drizzle-orm"
import { db } from ".."
import { emailTokens } from "../schema"


export const getVerificationTokenByEmail = async (email: string) => {
    try {
        const verificationToken = await db.query.emailTokens.findFirst({
            where: eq(emailTokens.token, email)
        })
        return verificationToken
    } catch(error) {
        return null
    }
}

export const generateEmailVerificationToken = async (email: string) => {
    //generate token
    const token = crypto.randomUUID();

    // expires
    const expires = new Date(new Date().getTime() + 3600 * 1000)

    // check if we have an existing token
    const existingToken = await getVerificationTokenByEmail(email); // when we pass in the email here, its going to look up and see which email corresponds with the token that we have.

    //  if we do have an existing token then we should just delete it.
    if (existingToken) {
        await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id))
    }

    // create the verification token
    const verificationToken = await db.insert(emailTokens).values({
        email,
        token,
        expires,  
    })
    return verificationToken
}