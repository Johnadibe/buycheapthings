"use server"

import { eq } from "drizzle-orm"
import { db } from ".."
import { emailTokens, passwordResetTokens, twoFactorTokens, users } from "../schema"
import { error } from "console"
import crypto from "crypto"


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
    }).returning()
    return verificationToken
}

// 
export const newVerification = async (token: string) => {
    // check if we have an existing token
    const existingToken = await getVerificationTokenByEmail(token)
    if(!existingToken) return { error: "Token not found"}

    // check if it has expired
    const hasExpired = new Date(existingToken.expires) < new Date()

    if(hasExpired) return { error: "Toke has expired"}

    // check for our existing user
    const existingUser = db.query.users.findFirst({
        where: eq(users.email, existingToken.email)
    })
    if(!existingUser) return { error: "Email does not exist" }
    // otherwise
    await db.update(users).set({
        emailVerified: new Date(),
        email: existingToken.email,
    })

    await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id))

    return { success: "Email verified"}
}

// get the password reset token in the database using the token
export const getPasswordResetTokenByToken = async (token: string) => {
    try {
        const passwordResetToken = await db.query.passwordResetTokens.findFirst({
            where: eq(passwordResetTokens.token, token)
        })
        return passwordResetToken
    } catch {
        return null
    }
}

// get password rest token by email
export const getPasswordResetTokenByEmail = async (email: string) => {
    try {
        const passwordResetToken = await db.query.passwordResetTokens.findFirst({
            where: eq(passwordResetTokens.email, email)
        })
        return passwordResetToken
    } catch {
        return null
    }
}

// generate token for password reset
export const generatePasswordResetToken = async (email: string) => {
    try {
        // generate the token 
    const token = crypto.randomUUID()
    
    // expires 
    const expires = new Date(new Date().getTime() + 3600 * 1000)

    // if we have an existing token then delete it, get password reset token by email
    const existingToken = await getPasswordResetTokenByEmail(email)
    if(existingToken) {
        await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, existingToken.id))
    }

    // insert the values of the passwordresettokens in the database
    const passwordResetToken = await db.insert(passwordResetTokens).values({
        email,
        token,
        expires,
    }).returning()

        // return the password reset token
    return passwordResetToken 
    } catch {
        return null
    }
}

// 
export const getTwoFactorTokenByEmail = async (email: string) => {
     try {
        const twoFactorToken = await db.query.twoFactorTokens.findFirst({
            where: eq(twoFactorTokens.email, email)
        })
        return twoFactorToken
    } catch {
        return null
    }
}

// 
export const getTwoFactorTokenByToken = async (token: string) => {
    try {
        const twoFactorToken = await db.query.twoFactorTokens.findFirst({
            where: eq(twoFactorTokens.token, token)
        })
        return twoFactorToken
    } catch {
        return null
    }
}

// generate token for two factor
export const generateTwoFactorToken = async (email: string) => {
    try {
        // generate the token 
    const token = crypto.randomInt(100_000, 1_000_000).toString()
    
    // expires 
    const expires = new Date(new Date().getTime() + 3600 * 1000)

    // if we have an existing token then delete it, get two factor token by email
    const existingToken = await getTwoFactorTokenByEmail(email)
    if(existingToken) {
        await db.delete(twoFactorTokens).where(eq(twoFactorTokens.id, existingToken.id))
    }

    // insert the values of the twofactortokens in the database
    const twoFactorToken = await db.insert(twoFactorTokens).values({
        email,
        token,
        expires,
    }).returning()

        // return the password reset token
    return twoFactorToken 
    } catch {
        return null
    }
}