"use client"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import { useSearchParams } from "next/navigation"
import { reviewsSchema } from "@/types/reviews-schema"
import { Textarea } from "../ui/textarea"
import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ReviewsForm() {
    const searchParams = useSearchParams()
    const productID = Number(searchParams.get("productID"))

    const form = useForm<z.infer<typeof reviewsSchema>>({
        resolver: zodResolver(reviewsSchema),
        defaultValues: {
            rating: 0,
            comment: "",
        }
    })

    const onSubmit = (values: z.infer<typeof reviewsSchema>) => {
        console.log(values)
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <div className="w-full">
                    <Button className="font-medium w-full" variant={"secondary"}>Leave a review</Button>
                </div>
            </PopoverTrigger>
            <PopoverContent>
                <Form {...form}>
                    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                        {/* comment field */}
                        <FormField control={form.control} name="comment" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Leave your review</FormLabel>
                                <FormControl>
                                    <Textarea {...field} placeholder="How would you describe this product?" />
                                </FormControl>
                            </FormItem>
                        )} />

                        {/* rating field */}
                        <FormField control={form.control} name="rating" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Leave your Rating</FormLabel>
                                <FormControl>
                                    <Input type="hidden" placeholder="Star Rating" {...field} />
                                </FormControl>
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((value) => {
                                        return (
                                            <motion.div key={value} className="relative cursor-pointer" whileTap={{ scale: 0.8 }} whileHover={{ scale: 1.2 }}>
                                                <Star key={value} onClick={() => {
                                                    form.setValue("rating", value)
                                                }} className={cn("text-primary bg-transparent transition-all duration-300 ease-in-out", form.getValues("rating") >= value ? "text-primary" : "text-muted")} />
                                            </motion.div>
                                        )
                                    })}
                                </div>
                            </FormItem>
                        )} />
                        <Button className="w-full" type="submit">
                            Add Review
                        </Button>
                    </form>
                </Form>
            </PopoverContent>
        </Popover>
    )
}