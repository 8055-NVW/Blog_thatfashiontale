import { env } from "@/config/env";
import AboutMe from "@/components/homepage/AboutMe";
import CategoryPostView from "@/components/homepage/CategoryPostView";
import Featured from "@/components/homepage/Featured";
import GetInTouch from "@/components/homepage/GetInTouch";
import { getCategories } from "@/lib/api/categories";
import { getPosts } from "@/lib/api/posts";
import Hero from "src/components/homepage/Hero";

export const dynamic = "force-dynamic";

export default async function HomePage() {
   const baseUrl = new URL(env.AUTH_URL).origin;

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
