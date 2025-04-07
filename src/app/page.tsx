"use client"

import React, { useState } from 'react';
import TopBar from '@/components/TopBar';
import NavBar from '@/components/NavBar';
import Hero from '@/components/Hero';

// Types
interface BlogPost {
  id: number;
  title: string;
  imageUrl: string;
}

// Sample data
const samplePosts: BlogPost[] = [
  { id: 1, title: 'Spring Collection Trends', imageUrl: '/images/spring.jpg' },
  { id: 2, title: 'Travel Guide: Paris', imageUrl: '/images/paris.jpg' },
  { id: 3, title: 'Minimalist Home Decor', imageUrl: '/images/decor.jpg' },
  { id: 4, title: 'Sustainable Fashion', imageUrl: '/images/sustainable.jpg' },
  { id: 5, title: 'Summer Getaway Essentials', imageUrl: '/images/summer.jpg' },
  { id: 6, title: 'Morning Routine', imageUrl: '/images/routine.jpg' },
];

// Get daily quote
const getQuoteOfTheDay = () => {
  const quotes = [
    "Style is a way to say who you are without having to speak.",
    "Life isn't perfect, but your outfit can be.",
    "Travel far enough, you meet yourself.",
    "Simplicity is the ultimate sophistication.",
    "Fashion fades, style is eternal."
  ];
  return quotes[Math.floor(Math.random() * quotes.length)];
};

export default function Home() {

  return (
    <div className="h-screen" style={{ backgroundColor: '#f8f5f2' }}>
      {/* Collapsable topbar with search and socials */}
      <TopBar/>
      {/* Navigation bar  */}
      <NavBar/>

      {/* Main content area */}
      <main className="container mx-auto p-4">       
            {/* Hero section */}
            <Hero/>

            {/* Featured posts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              
            </div>

            {/* Contact section */}
            <div className="p-8 text-center" style={{ backgroundColor: '#fff', border: '1px solid #d8e2dc' }}>
              <h2 className="mb-4 text-xl" style={{ color: '#2d334a' }}>Contact me section</h2>
              <p style={{ color: '#5c5c5c' }}>Get in touch for collaborations, questions, or just to say hello!</p>
            </div>
      </main>
      {/* Footer */}
      <footer className="p-6 text-center" style={{ backgroundColor: '#d8e2dc', color: '#2d334a' }}>
        <p>© 2025 Lifestyle Blog. All rights reserved.</p>
      </footer>
    </div>
  );
}