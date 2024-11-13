import zod from "zod"

export const orderSchema = zod.object({
    total: zod.number(),
    status: zod.string(),
    paymentIntentID: zod.string(),
    products: zod.array(zod.object({
        productID: zod.number(),
        variantID: zod.number(),
        quantity: zod.number(),
    }))
})