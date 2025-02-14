'use client'
import Body from "@/src/components/body";
import { useRouter } from "next/navigation"
import { useEffect } from "react";

export default function Page(){
    const router = useRouter();

    useEffect(() => {
        router.push('/signin')
    })

    return <Body className="w-screen h-screen flex justify-center items-center">
        <h1>Redirecting ...</h1>
    </Body>
}