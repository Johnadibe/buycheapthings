"use server"

import { SettingsSchema } from "@/types/settings-schema"
import { createSafeActionClient } from "next-safe-action"
import { auth } from "../auth"
import { db } from ".."
import { eq } from "drizzle-orm"
import { users } from "../schema"
import bcrypt from "bcrypt"
import { revalidatePath } from "next/cache"

const action = createSafeActionClient()

export const settings = action(SettingsSchema, async (values) => {
    // check if the user is signed in from our session (logged in from form)
    const user = await auth()
    if(!user) {
        return {error: "User not found"}
    }
    // Let's also check if we have the user in the database
    const dbUser = await db.query.users.findFirst({
        where: eq(users.id, user.user.id)
    })
      if(!dbUser) {
        return {error: "User not found"}
    }

    // check the oAuth (check if the user is signed in through google or github)
    if(user.user.isOAuth) {
        values.email = undefined
        values.password = undefined
        values.newPassword = undefined
        values.image = undefined
    }

    // we compare the passwords
    if(values.password && values.newPassword && dbUser.password) {
        const passwordMatch = bcrypt.compare(values.password, dbUser.password)
        if(!passwordMatch) {
            return {error: "Password does not match"}
        }

        const samePassword = await bcrypt.compare(values.newPassword, dbUser.password)
         if(samePassword) {
            return {error: "New Password is the same as the old password"}
        }

        // Finaly, we can set the new password
        const harshedPassword = await bcrypt.hash(values.newPassword, 10)
        values.password = harshedPassword
        values.newPassword = undefined
    }

     // update the user after that
        const updatedUser = await db.update(users).set({
            name: values.name,
            email: values.email,
            password: values.password,
            image: values.image
        }).where(eq(users.id, dbUser.id))
        // revalidate the path (this refreshes the UI to see the changes)
        revalidatePath("/dashboard/settings")

        return { success: "Settings updated" }
})