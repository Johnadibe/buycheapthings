"use client"

import { productsWithVariants, VariantsWithImagesTags } from "@/lib/infer-type"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { variantSchema } from "@/types/variant-schema"
import { z } from "zod"

export default function ProductVariant({ editMode, productID, variant, children }: { editMode: boolean, productID?: number, variant?: VariantsWithImagesTags, children: React.ReactNode }) {
    const form = useForm<z.infer<typeof variantSchema>>({
        resolver: zodResolver(variantSchema),
        defaultValues: {
            tags: [],
            variantImages: [],
            color: "#000000",
            editMode,
            id: undefined,
            productID,
            productType: "Black Notebook",
        },
    })

    // onSubmit handler
    function onSubmit(values: z.infer<typeof variantSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }

    return (
        // render dialog component from shadcn
        <Dialog>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editMode ? "Edit" : "Create"} your variant</DialogTitle>
                    <DialogDescription>
                        Manage your product variants here. You can add tags, images, and more
                    </DialogDescription>
                </DialogHeader>
                {/* shadcn form */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="productType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Variant Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Pick a title for your variant" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="color"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Variant Color</FormLabel>
                                    <FormControl>
                                        <Input type="color" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tags</FormLabel>
                                    <FormControl>
                                        {/* <InputTags /> */}
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* <VariantImages /> */}
                        {editMode && variant && (
                            <Button type="button" onClick={(e) => e.preventDefault()}>
                                Delete Variant
                            </Button>
                        )}
                        <Button type="submit">{editMode ? "Update Variant" : "Create Variant"}</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>

    )
}