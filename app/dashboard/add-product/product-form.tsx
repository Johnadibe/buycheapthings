"use client"

import { productSchema, zProductSchema } from "@/types/product-schema"
import { useForm } from "react-hook-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Tiptap from "./tiptap"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { createProduct } from "@/server/actions/create-product"
import { z } from "zod"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { getProduct } from "@/server/actions/get-product"
import { useCallback, useEffect } from "react"

export default function ProductForm() {

  const form = useForm<zProductSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    },
    mode: "onChange"
  })

  // redirect a user
  const router = useRouter()

  // get the id from the search route
  const searchParams = useSearchParams()
  const editMode = searchParams.get("id")

  // A function to check if the product exist or not
  const checkProduct = useCallback(async (id: number) => {
    if (editMode) {
      const data = await getProduct(id)
      if (data.error) {
        toast.error(data.error)
        router.push("/dashboard/products")
        return
      }
      if (data.success) {
        form.setValue("title", data.success.title)
        form.setValue("description", data.success.description)
        form.setValue("price", data.success.price)
        form.setValue("id", data.success.id)
      }
    }
  }, [editMode, form, router])

  // 
  useEffect(() => {
    if (editMode) {
      checkProduct(parseInt(editMode))
    }
  }, [checkProduct, editMode])

  // 
  const { execute, status } = useAction(createProduct, {
    onSuccess: (data) => {
      if (data?.error) {
        toast.error(data.error)
      }
      if (data?.success) {
        router.push("/dashboard/products")
        toast.success(data.success)
      }
    },
    onExecute: () => {
      if (editMode) toast.loading("Editing Product")
      if (!editMode) toast.loading("Creating Product")
    },
  })

  // onSubmit
  const onSubmit = (values: z.infer<typeof productSchema>) => {
    execute(values)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editMode ? "Edit Product" : "Create Product"}</CardTitle>
        <CardDescription>{editMode ? "Make changes to existing product" : "Add a new product"}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Saekdong Stripe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Tiptap val={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Price</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <span className="py-2 rounded-md text-2xl">₦</span>
                      <Input {...field} type="number" placeholder="Your price in NGN" step="0.1" min={0} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={status === "executing" || !form.formState.isValid || !form.formState.isDirty}>{editMode ? "Save Changes" : "Create Product"}</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}