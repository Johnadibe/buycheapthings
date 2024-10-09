"use client"

import { productSchema, zProductSchema } from "@/types/product-schema"
import { useForm } from "react-hook-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { DollarSign } from "lucide-react"

export default function ProductForm(){

    const form = useForm<zProductSchema>({
        defaultValues: {
            title: "",
            description: "",
            price: 0,
        }
    })
    return (
       <Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <Form {...form}>
      {/* <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8"> */}
      <form onSubmit={() => console.log("Hey")} className="space-y-4">
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
                {/* <Input placeholder="Saekdong Stripe" {...field} /> */}
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
                    {/* <DollarSign size={32} className="py-2 bg-muted rounded-md" /> */}
                    <span className="py-2 rounded-md text-2xl">₦</span>
                    <Input {...field} type="number" placeholder="Your price in NGN" step="0.1" min={0} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit" disabled={status === "executing" || !form.formState.isValid || !form.formState.isDirty}>Submit</Button>
      </form>
    </Form>
  </CardContent>
  <CardFooter>
    <p>Card Footer</p>
  </CardFooter>
</Card>
    )
}