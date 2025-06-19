
import AboutMe from "@/components/homepage/AboutMe";
import CategoryPostView from "@/components/homepage/CategoryPostView";
import Featured from "@/components/homepage/Featured";
import GetInTouch from "@/components/homepage/GetInTouch";
import { getCategories } from "@/lib/api/categories";
import { getPosts } from "@/lib/api/posts";
import Hero from "src/components/homepage/Hero";

export default async function HomePage() {
   const [allPosts,allCategories] = await Promise.all([
    getPosts(),
    getCategories(),
  ]);

  const posts = allPosts.posts

  return (
    <div className="space-y-20 px-4 md:px-8 py-10 max-w-7xl mx-auto" style={{ backgroundColor: "#f8f5f2" }}>
        <Hero/>
        <Featured posts={posts}/>
        {/* <CategoryFilter categories={allCategories}/>
        <PostGrid posts={posts}/> */}
        <CategoryPostView posts={posts} categories={allCategories} />
        <AboutMe/>
        <GetInTouch/>
    </div>
  );
}

