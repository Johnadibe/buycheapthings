import { db } from "@/server"
import placeholder from "@/public/placeholder-image.jpg"
import { DataTable } from "./data-table"
import { columns } from "./columns"

export default async function Products() {
    // fetch the products from the database
    const products = await db.query.products.findMany({
        orderBy: (product, { desc }) => [desc(product.id)]
    })
    if(!products) throw new Error("No products found")

    const dataTable = products.map((product) => {
        return {
            id: product.id,
            title: product.title,
            price: product.price,
            variants: [],
            image: placeholder.src,
        }
    })
    if(!dataTable) throw new Error("No data found")
    return (
        <div>
            <DataTable columns={columns} data={dataTable} />
        </div>
    )
}