import { db } from "@/server"
import placeholder from "@/public/placeholder-image.jpg"
import { DataTable } from "./data-table"
import { columns } from "./columns"

export default async function Products() {
    // fetch the products from the database
    const products = await db.query.products.findMany({
        with: {
            productVariants: { with: { variantImages: true, variantTags: true } },
        },
        orderBy: (products, { desc }) => [desc(products.id)]
    })
    if (!products) throw new Error("No products found")

    const dataTable = products.map((product) => {
        if (product.productVariants.length === 0) {
            return {
                id: product.id,
                title: product.title,
                price: product.price,
                image: placeholder.src,
                variants: [],
            }
        }

        // const image = product.productVariants[0].variantImages.length > 0 ? product.productVariants[0].variantImages[0].url : placeholder.src
        const image = product.productVariants[0].variantImages[0].url
        return {
            id: product.id,
            title: product.title,
            price: product.price,
            image,
            variants: product.productVariants,
        }
    })
    if (!dataTable) throw new Error("No data found")
    return (
        <div>
            <DataTable columns={columns} data={dataTable} />
        </div>
    )
}