/* eslint-disable @typescript-eslint/no-explicit-any */
export default function cn(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
}