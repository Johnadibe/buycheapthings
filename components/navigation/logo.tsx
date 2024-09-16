import Image from "next/image";
import LogoImage from "@/public/logo.svg"

export default function Logo() {
    return (
        <Image src={LogoImage} alt=""></Image>
    )
}