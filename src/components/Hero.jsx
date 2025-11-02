import React from 'react';
import Spline from '@splinetool/react-spline';

export default function Hero() {
  return (
    <section className="relative h-[70vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/EF7JOSsHLk16Tlw9/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end">
        <div className="pb-10">
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight">
            AI-powered Marine Species Detection
          </h1>
          <p className="mt-3 text-white/70 max-w-2xl">
            Upload underwater images or video to detect, classify, and learn about marine life. Real-time analysis powered by modern vision models and Gemini AI insights.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a href="#analyze" className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-600 font-medium hover:opacity-90 transition">
              Get started
            </a>
            <a href="#history" className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
              View history
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
