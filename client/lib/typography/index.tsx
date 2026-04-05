import { Alegreya, Poppins } from "next/font/google";


export const PrimaryFont = Alegreya({
    display: "auto",
    subsets: ["latin"],
    weight: ["400", "500", "700"]
})

export const SecondaryFont = Poppins({
    display: "auto",
    subsets: ["latin"],
    weight: ["400", "500", "700"]
})