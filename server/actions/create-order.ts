"use server"

import { orderSchema } from "@/types/order-schema"
import { createSafeActionClient } from "next-safe-action"
import { auth } from "../auth"
import { db } from ".."
import { orderProduct, orders } from "../schema"
import { z } from "zod"

const action = createSafeActionClient()

// Infer the type for products from orderSchema
type OrderProduct = z.infer<typeof orderSchema>["products"][number];

export const createOrder = action(orderSchema, async ({ products, total, status, paymentIntentID }) => {
    // get the user
    const user = await auth()
    if (!user) return { error: "User not found" }

    // order
    const order = await db.insert(orders).values({
        total,
        paymentIntentID,
        status,
        userID: user.user.id,
    }).returning()

    // save all the order product, so each individual product should also be saved.
    const orderProducts = products.map(async ({ productID, quantity, variantID }: OrderProduct) => {
        const newOrderProduct = await db.insert(orderProduct).values({
            quantity,
            orderID: order[0].id,
            productID,
            productVariantID: variantID,
        })
    })
    return { success: "Order has been added" }
})