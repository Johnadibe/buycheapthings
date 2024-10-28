"use client"

import { useCartStore } from "@/lib/client-store"
import { ShoppingCart } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTrigger } from "../ui/drawer";
import { motion, AnimatePresence } from "framer-motion";
import CartItem from "./cart-items";
import CartMessage from "./cart-message";
import Payment from "./payment";

export default function CartDrawer() {
    const { cart, checkoutProgress, setCheckoutProgress } = useCartStore();
    return (
        <Drawer>
            <DrawerTrigger>
                <div className="relative px-2">
                    <AnimatePresence>
                        {cart.length > 0 && (
                            <motion.span animate={{ scale: 1, opacity: 1 }} initial={{ opacity: 0, scale: 0 }} exit={{ scale: 0 }} className="absolute flex items-center justify-center -top-1 -right-0.5 w-4 h-4 dark:bg-primary bg-primary text-white text-xs font-bold rounded-full">
                                {cart.length}
                            </motion.span>
                        )}
                    </AnimatePresence>
                    <ShoppingCart />
                </div>
            </DrawerTrigger>
            <DrawerContent className="min-h-50vh">
                <DrawerHeader>
                    <CartMessage />
                </DrawerHeader>
                <div className="overflow-auto p-4"> {/* overflow-auto makes it to be scrollable if there are too many cart items  */}
                    {checkoutProgress === "cart-page" && <CartItem />}
                    {checkoutProgress === "payment-page" && <Payment />}
                    {checkoutProgress === "confirmation-page" && <div onClick={() => setCheckoutProgress("cart-page")}>Confirmation Page</div>}
                </div>
            </DrawerContent>
        </Drawer>
    )
}