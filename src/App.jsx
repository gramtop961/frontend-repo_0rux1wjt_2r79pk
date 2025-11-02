import React from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Analyzer from './components/Analyzer.jsx';
import History from './components/History.jsx';

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white antialiased">
      <Navbar />
      <Hero />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        <Analyzer />
        <History />
      </main>
      <footer className="border-t border-white/10 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-white/60">
          © {new Date().getFullYear()} Marine Vision AI · Built with React, FastAPI, and Gemini AI
        </div>
      </footer>
    </div>
  );
}
