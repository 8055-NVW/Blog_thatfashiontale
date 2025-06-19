
import AboutMe from "@/components/homepage/AboutMe";
import CategoryFilter from "@/components/homepage/CategoryFilter";
import Featured from "@/components/homepage/Featured";
import GetInTouch from "@/components/homepage/GetInTouch";
import PostGrid from "@/components/homepage/PostGrid";
import { getCategories } from "@/lib/api/categories";
import { getPosts } from "@/lib/api/posts";
import Hero from "src/components/homepage/Hero";

export default async function HomePage() {
   const [postsData,categoryData] = await Promise.all([
    getPosts(),
    getCategories(),
  ]);
  console.log(postsData);
  console.log(categoryData)

  return (
    <div className="space-y-20 px-4 md:px-8 py-10 max-w-7xl mx-auto" style={{ backgroundColor: "#f8f5f2" }}>
        <Hero/>
        {/* <Featured posts={postData}/>
        <CategoryFilter categories={categoryData}/>
        <PostGrid posts={postData}/> */}
        <AboutMe/>
        <GetInTouch/>
    </div>
  );
}

