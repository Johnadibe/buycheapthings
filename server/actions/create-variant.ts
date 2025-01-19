"use server"

import { VariantSchema } from "@/types/variant-schema"
import { createSafeActionClient } from "next-safe-action"
import { db } from ".."
import { eq } from "drizzle-orm"
import { products, productVariants, variantImages, variantTags } from "../schema"
import { revalidatePath } from "next/cache"
import algoliasearch from "algoliasearch"
import { z } from "zod"

const action = createSafeActionClient()

const client = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_ID!, process.env.ALGOLIA_ADMIN!)

const algoliaIndex = client.initIndex("products");

type VariantImage = z.infer<typeof VariantSchema>["variantImages"][number];

export const createVariant = action(VariantSchema, async ({ color, editMode, id, productID, productType, tags, variantImages: newImgs }) => {
    try {
        // check if we are in edit mode
        if (editMode && id) {
            const editVariant = await db.update(productVariants).set({ color, productType, updated: new Date() }).where(eq(productVariants.id, id)).returning()
            // clear our variant tags
            await db.delete(variantTags).where(eq(variantTags.variantID, editVariant[0].id))
            // insert new variant tags
            await db.insert(variantTags).values(tags.map((tag: string) => ({
                tag, variantID: editVariant[0].id
            })))
            // we will do the images as well
            await db.delete(variantImages).where(eq(variantImages.variantID, editVariant[0].id))
            // 
            await db.insert(variantImages).values(
                // newImgs.map((img: { url: string; size: number; key?: string; id?: number; name: string }, index: number) => ({
                newImgs.map((img: VariantImage, index: number) => ({
                    name: img.name,
                    size: img.size,
                    url: img.url,
                    variantID: editVariant[0].id,
                    order: index,
                }))
            )

            // algolia
            algoliaIndex.partialUpdateObject({
                objectID: editVariant[0].id.toString(),
                id: editVariant[0].productID,
                productType: editVariant[0].productType,
                variantImages: newImgs[0].url,
            })

            revalidatePath("/dashboard/products")
            return { success: `Edited ${productType}` }
        }
        // if we are not in editMode
        if (!editMode) {
            const newVariant = await db.insert(productVariants).values({ color, productType, productID }).returning()

            // 
            const product = await db.query.products.findFirst({
                where: eq(products.id, productID)
            })
            await db.insert(variantTags).values(
                tags.map((tag: string) => ({
                    tag, variantID: newVariant[0].id
                }))
            )

            await db.insert(variantImages).values(
                // newImgs.map((img: { url: string; size: number; key?: string; id?: number; name: string }, index: number) => ({
                newImgs.map((img: VariantImage, index: number) => ({
                    name: img.name,
                    size: img.size,
                    url: img.url,
                    variantID: newVariant[0].id,
                    order: index,
                }))
            )

            // algolia
            if (product) {
                algoliaIndex.saveObject({
                    objectID: newVariant[0].id.toString(),
                    id: newVariant[0].productID,
                    title: product.title,
                    price: product.price,
                    productType: newVariant[0].productType,
                    variantImages: newImgs[0].url,
                })
            }

            revalidatePath("/dashboard/products")
            return { success: `Added ${productType}` }
        }
    } catch (error) {
        return { error: "Failed to create variant" }
    }
})