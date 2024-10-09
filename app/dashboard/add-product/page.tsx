import { auth } from "@/server/auth"
import { redirect } from "next/navigation"
import { productSchema } from "@/types/product-schema"
import { useForm } from "react-hook-form"
import * as z from "zod"
import ProductForm from "./product-form"

export default async function AddProduct() {
    const session = await auth()
    if(session?.user.role !== "admin") return redirect("/dashboard/settings")

    return (
        <ProductForm />
    )
}