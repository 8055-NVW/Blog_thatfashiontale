"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function CreateCategory(){
    const { data: session, status} = useSession();
    const router = useRouter();
    const [categories, setCategories] = useState("");
    const [form, setForm] = useState({name: "", slug:"", description:""})

    const getCategories = async () => {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setCategories(data);
    }

    useEffect(() => {
        getCategories()
    }, []);

    const handleSubmit= async (e: React.FormEvent) => {
        e.preventDefault();
        // will redirect in all scenarios to home or login page with a message
        if(!session?.user?.id) {
            return alert("Not authenticated");
        }

        const res = await fetch
    }

    return (
        <form onSubmit={handleSubmit} className="">



        </form>
    )
}