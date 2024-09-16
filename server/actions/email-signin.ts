"use server"

import { LoginSchema } from "@/types/login-schema";
import {createSafeActionClient} from "next-safe-action";
import { db } from "..";
import { users } from "../schema";
import { eq } from "drizzle-orm";

const action = createSafeActionClient();

export const emailSignIn = action(LoginSchema, async ({email, password, code}) => {
    
    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email)
    })

    // check if the user exist in the database
    if(existingUser?.email !== email) {
        return { error: "Email not found"}
    }

    // check if the user 
    // if(!existingUser?.emailVerified) {}

    console.log(email, password, code);
    return { success: email }
})