import zod from "zod"

export const paymentIntentSchema = zod.object({
    amount: zod.number(),
    currency: zod.string(),
    cart: zod.array(zod.object({
        quantity: zod.number(),
        productID: zod.number(),
        title: zod.string(),
        price: zod.number(),
        image: zod.string(),
    }))
})