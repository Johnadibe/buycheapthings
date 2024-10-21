export default function formatPrice(price: number) {
    return new Intl.NumberFormat("en-NG", {
        currency: "NGN",
        style: "currency",
    }).format(price)
}