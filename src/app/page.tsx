"use client";

import Hero from "@/components/Hero";
import NavBar from "@/components/NavBar";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";

// Get daily quote
const getQuoteOfTheDay = () => {
  const quotes = [
    "Style is a way to say who you are without having to speak.",
    "Life isn't perfect, but your outfit can be.",
    "Travel far enough, you meet yourself.",
    "Simplicity is the ultimate sophistication.",
    "Fashion fades, style is eternal.",
  ];
  return quotes[Math.floor(Math.random() * quotes.length)];
};

export default function Home() {

  return (
    <div className="h-screen" style={{ backgroundColor: "#f8f5f2" }}>
      <TopBar />
      <NavBar />
      <main className="container mx-auto p-4">
        <Hero />
        {/* Featured posts */}
        {/* Contact section */}
        <section className="mt-8 text-center">
          <h2 className="text-xl mb-4">Welcome to That Fashion Tale</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Discover curated fashion, lifestyle, and travel stories. Explore posts, shop the looks, and find your style inspiration.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}

// "use server";

// import { SignInButton } from "@/components/SignInButton";
// import { auth } from "@/auth";
// import Image from "next/image";
// import { SignOutButton } from "@/components/SignOutButton";

// export default async function Home() {
//   const session = await auth();

//   console.log("Session user:", session?.user);
//   // console.log("🔐 Server-side session:", session);


//   if (session?.user) {
//     return (
//       <div>
//         <h1>Learning login</h1>
//         <p>User signed in with name: {session.user.name}</p>
//         <p>User signed in with email: {session.user.email}</p>
//         {session.user.image && <Image
//           src={session.user.image}
//           alt={session?.user?.name ?? "Avatar"}
//           width={45}
//           height={45}
//           style={{ borderRadius: "50%" }}
//         />}
//         <SignOutButton />
//       </div>
//     );
//   }
//   return (
//     <>
//       <div>
//         <p>You are not Signed In</p>
//         <SignInButton />
//       </div>
//     </>
//   );
// }
