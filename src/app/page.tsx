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

