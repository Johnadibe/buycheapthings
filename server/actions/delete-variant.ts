"use server"

import { VariantSchema } from "@/types/variant-schema"
import { createSafeActionClient } from "next-safe-action"
import { z } from "zod"
import { db } from ".."
import { productVariants } from "../schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

const action = createSafeActionClient()

export const deleteVariant = action(z.object({id: z.number()}), async ({ id }) => {
    try {
        const data = await db.delete(productVariants).where(eq(productVariants.id, id)).returning()

        revalidatePath("/dashboard/products")
        return { success: `Variant ${data[0].productType} has been deleted`}
    } catch (error) {
        return { error: "Failed to delete variant" }
    }
})