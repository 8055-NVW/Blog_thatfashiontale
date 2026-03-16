
import { headers } from "next/headers";
import AboutMe from "@/components/homepage/AboutMe";
import CategoryPostView from "@/components/homepage/CategoryPostView";
import Featured from "@/components/homepage/Featured";
import GetInTouch from "@/components/homepage/GetInTouch";
import { getCategories } from "@/lib/api/categories";
import { getPosts } from "@/lib/api/posts";
import Hero from "src/components/homepage/Hero";

export default async function HomePage() {
   const requestHeaders = await headers();
   const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
   const protocol = requestHeaders.get("x-forwarded-proto")
    ?? (host?.includes("localhost") || host?.startsWith("127.0.0.1") ? "http" : "https");
   const baseUrl = host ? `${protocol}://${host}` : undefined;

   const [allPosts,allCategories] = await Promise.all([
    getPosts({}, { baseUrl }),
    getCategories({ baseUrl }),
  ]);

  const posts = allPosts.posts

  return (
    <div className="space-y-20 px-4 md:px-8 py-10 max-w-7xl mx-auto" style={{ backgroundColor: "#f8f5f2" }}>
        <Hero/>
        <section id="featured-post">
          <Featured posts={posts}/>
        </section>
        {/* <CategoryFilter categories={allCategories}/>
        <PostGrid posts={posts}/> */}
        <CategoryPostView posts={posts} categories={allCategories} />
        <AboutMe/>
        <GetInTouch/>
    </div>
  );
}
