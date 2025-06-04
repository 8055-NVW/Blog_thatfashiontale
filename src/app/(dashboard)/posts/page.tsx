'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const Posts = () => {
    const router = useRouter();
    const { data: session, status } = useSession();

    const [posts, setPosts] = useState([])

    useEffect(() => {
        const fetchPosts = async () => {
            const res = await fetch("/api/posts");
            const data = await res.json();
            console.log(data)
            setPosts(data);
        };
        fetchPosts();
    }, []);


    return (
        <h1>show posts here</h1>
    )
}

export default Posts