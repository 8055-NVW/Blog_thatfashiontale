
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
    <div className="shell-container space-y-16 py-10 md:space-y-20 md:py-14">
        <Hero postCount={posts.length} categoryCount={allCategories.length} />
        <section id="featured-post">
          <Featured posts={posts}/>
        </section>
        <CategoryPostView posts={posts} categories={allCategories} />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <AboutMe/>
          <GetInTouch/>
        </div>
    </div>
  );
}
