/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { ColumnDef, Row } from "@tanstack/react-table"
import { MoreHorizontalIcon, PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { useAction } from "next-safe-action/hooks"
import { deleteProduct } from "@/server/actions/delete-product"
import { toast } from "sonner"
import Link from "next/link"
import { VariantsWithImagesTags } from "@/lib/infer-type"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { ProductVariant } from "./product-variant"


type ProductColumn = {
    id: number
    title: string
    price: number
    image: string
    variants: VariantsWithImagesTags[]
}

const ActionCell = ({ row }: { row: Row<ProductColumn> }) => {
    const { execute } = useAction(deleteProduct, {
        onSuccess: (data) => {
            if (data.success) {
                toast.success(data.success)
            }
            if (data.error) {
                toast.error(data.error)
            }
        },
        onExecute: () => {
            toast.loading("Deleting Product")
        }
    })
    const product = row.original
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} className="h-8 w-8 p-0"><MoreHorizontalIcon className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="dark:focus:bg-primary focus:bg-primary/50 cursor-pointer"><Link href={`/dashboard/add-product?id=${product.id}`}>Edit Product</Link></DropdownMenuItem>
                <DropdownMenuItem className="dark:focus:bg-destructive focus:bg-destructive/50 cursor-pointer" onClick={() => execute({ id: product.id })}>Delete Product</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}

export const columns: ColumnDef<ProductColumn>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "variants",
        header: "Variants",
        cell: ({ row }) => {
            const variants = row.getValue("variants") as VariantsWithImagesTags[]
            return (
                <div className="flex items-center gap-2">
                    {variants.map((variant) => (
                        <div key={variant.id}>
                            {/* tooltip from shadcn */}
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <ProductVariant productID={variant.productID} variant={variant} editMode={true}>
                                            <div className="w-5 h-5 rounded-full" key={variant.id} style={{ background: variant.color }} />
                                        </ProductVariant>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{variant.productType}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                        </div>
                    ))}
                    {/* tooltip from shadcn */}
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span>
                                    <ProductVariant productID={row.original.id} editMode={false}>
                                        <PlusCircle className="w-4 h-4" />
                                    </ProductVariant>
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Create a new product variant</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div >
            )
        }
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => {
            const price = parseFloat(row.getValue("price"))
            const formatted = new Intl.NumberFormat("en-NG", {
                currency: "NGN",
                style: "currency"
            }).format(price)
            return (
                <div className="font-medium text-xs">
                    {formatted}
                </div>
            )
        }
    },
    {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) => {
            const cellImage = row.getValue("image") as string
            const cellTitle = row.getValue("title") as string
            return (
                <div>
                    <Image src={cellImage} alt={cellTitle} width={50} height={50} className="rounded-md" />
                </div>
            )
        }
    },
    {
        accessorKey: "actions",
        header: "Actions",
        cell: ActionCell,
    },
]
