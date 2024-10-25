"use server"

import { reviewsSchema } from "@/types/reviews-schema"
import { createSafeActionClient } from "next-safe-action"
import { auth } from "../auth"
import { db } from ".."
import { and, eq } from "drizzle-orm"
import { reviews } from "../schema"
import { revalidatePath } from "next/cache"

const action = createSafeActionClient()

export const addReview = action(reviewsSchema, async ({ productID, rating, comment }) => {
    try {
        // Make sure that the user is signed in
        const session = await auth()
        if (!session) return { error: "Please sign in" }

        // check if the review already exist in db
        const reviewExists = await db.query.reviews.findFirst({
            // we will do a two chere here, check where a user has already left a review on the product
            where: and(eq(reviews.productID, productID), eq(reviews.userID, session.user.id))
        })
        if (reviewExists) return { error: "You have already reviewed this product" }

        // otherewise add the new review
        const newReview = await db.insert(reviews).values({
            productID, rating, comment, userID: session.user.id,
        }).returning()

        // revalidate path
        revalidatePath(`/products/${productID}`)

        // then return success message
        return { success: newReview[0] }
    } catch (err) {
        return { error: JSON.stringify(err) }
    }
})