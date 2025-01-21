export default function getBaseUrl() {
    if (typeof window !== "undefined") return ""
    if (process.env.VERCEL_URL) return `https://www.${process.env.DOMAIN_URL}`;
    return "http://localhost:3000"
}