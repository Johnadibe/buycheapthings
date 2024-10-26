"use client"

import { useCartStore } from "@/lib/client-store"
import { Table, TableBody, TableHead, TableCell, TableRow, TableHeader } from "../ui/table"
import { useMemo } from "react"
import formatPrice from "@/lib/format-price"
import Image from "next/image"
import { MinusCircle, PlusCircle } from "lucide-react"

export default function CartItem() {
    const { cart, addToCart, removeFromCart } = useCartStore()
    const totalPrice = useMemo(() => {
        return cart.reduce((acc, item) => acc + item.price! * item.variant.quantity, 0)
    }, [cart])
    return (
        <div>
            {cart.length === 0 && (
                <div>
                    <h1>Cart is empty</h1>
                </div>
            )}
            {cart.length > 0 && (
                <div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableCell>Product</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Image</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Total</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cart.map((item) => (
                                <TableRow key={item.id}>
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
                                    <TableCell>{totalPrice}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    )
}