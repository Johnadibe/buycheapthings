"use client"

import { useCartStore } from "@/lib/client-store"
import { Table, TableBody, TableHead, TableCell, TableRow, TableHeader } from "../ui/table"
import { useMemo } from "react"
import formatPrice from "@/lib/format-price"
import Image from "next/image"
import { MinusCircle, PlusCircle } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import Lottie from "lottie-react"
import emptyCart from "@/public/empty-box.json"
import { createId } from "@paralleldrive/cuid2"
import { Button } from "../ui/button"

export default function CartItem() {
    const { cart, addToCart, removeFromCart, setCheckoutProgress } = useCartStore()
    const totalPrice = useMemo(() => {
        return cart.reduce((acc, item) => acc + item.price * item.variant.quantity, 0)
    }, [cart])

    // 
    const priceInLetters = useMemo(() => {
        return [...totalPrice.toFixed(2).toString()].map((letter) => {
            return { letter, id: createId() }
        })
    }, [totalPrice])

    return (
        <motion.div className="flex flex-col items-center">
            {cart.length === 0 && (
                <div className="flex-col w-full flex items-center justify-center">
                    <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
                        <h2 className="text-2xl text-muted-foreground text-center">Your cart is empty</h2>
                        <Lottie className="h-64" animationData={emptyCart} />
                    </motion.div>
                </div>
            )}
            {cart.length > 0 && (
                <div className="max-h-80 w-full overflow-y-auto">
                    <Table className="max-w-2xl mx-auto">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Image</TableHead>
                                <TableHead>Quantity</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cart.map((item) => (
                                <TableRow key={(item.id + item.variant.variantID).toString()}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{formatPrice(item.price)}</TableCell>
                                    <TableCell>
                                        <div>
                                            <Image src={item.image} alt={item.name} width={48} height={48} priority />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-between">
                                            <MinusCircle className="cursor-pointer hover:text-muted-foreground duration-300 transition-colors" size={14} onClick={() => {
                                                removeFromCart({
                                                    ...item, variant: {
                                                        quantity: 1, variantID: item.variant.variantID,
                                                    }
                                                })
                                            }} />
                                            <p className="text-md font-bold">{item.variant.quantity}</p>
                                            <PlusCircle className="cursor-pointer hover:text-muted-foreground duration-300 transition-colors" size={14} onClick={() => {
                                                addToCart({
                                                    ...item, variant: { quantity: 1, variantID: item.variant.variantID }
                                                })
                                            }} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
            {/* The total and Next button */}
            <motion.div className="flex items-center justify-center relative overflow-hidden my-4">
                <span className="text-md">Total: ₦</span>
                <AnimatePresence mode="popLayout">
                    {priceInLetters.map((letter, index) => (
                        <motion.div key={letter.id}>
                            <motion.span initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }} transition={{ delay: index * 0.1 }} className="text-md inline-block">
                                {letter.letter}
                            </motion.span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
            {/* Button for go to the next */}
            <Button disabled={cart.length === 0} className="max-w-md w-full" onClick={() => setCheckoutProgress("payment-page")}>Checkout</Button>
        </motion.div>
    )
}