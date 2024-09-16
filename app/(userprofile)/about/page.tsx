import Link from "next/link"; {/* NextJS Link to different route */}

export default function About() {
    return (
        <div>
            <h1>
                About
            </h1>
            <p>This is the about Page</p>
            <Link href="/">Go back Home</Link> {/* NextJS Link to different route */}
        </div>
    )

}