"use client";

import { useCallback } from "react";
import Image from "next/image";

export function Hero() {
  const scrollToContact = useCallback(() => {
    const target = document.querySelector("#contact");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <section
      className="relative flex items-center justify-center min-h-screen w-full overflow-hidden"
      aria-label="Hero"
    >
      {/* Background image with dark overlay */}
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: "url('/images/hannaBG.jpg')" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-navy/60"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 animate-fade-in">
        <p className="font-body text-gold text-sm sm:text-base tracking-[0.3em] uppercase mb-4">
          Professional Services
        </p>
        <h1 className="font-heading text-warm-white text-6xl sm:text-7xl md:text-8xl font-bold tracking-widest mb-1">
          SWEIS
        </h1>
        <p className="font-heading text-gold-light text-xl sm:text-2xl md:text-3xl font-normal tracking-wide mb-0">
          Bookkeeping Services
        </p>
        <div className="max-w-xl mx-auto flex justify-center mt-14 mb-12">
          <Image
            src="/motto.png"
            alt="Helping small businesses stay on top of their finances — Las Vegas, NV"
            width={375}
            height={103}
            className="w-auto h-auto max-w-full"
            priority
          />
        </div>
        <button
          type="button"
          onClick={scrollToContact}
          className="inline-block font-body font-semibold text-navy bg-gold hover:bg-gold-light px-8 py-3 rounded tracking-wider uppercase text-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy"
        >
          Get Started
        </button>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
        aria-hidden="true"
      >
        <svg
          className="w-6 h-6 text-gold/60"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
