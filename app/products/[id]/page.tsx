export default function Products({params}: {params: {id: string}}) {
    return (
        <div>
            <h1>Params: {params.id}</h1>
        </div>
    )
}