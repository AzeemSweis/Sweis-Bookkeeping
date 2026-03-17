"use client";

import { useState, useEffect, useCallback } from "react";

interface Testimonial {
  id: number;
  client_name: string;
  company: string;
  quote: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (index === current || fading) return;
      setFading(true);
      setTimeout(() => {
        setCurrent(index);
        setFading(false);
      }, 300);
    },
    [current, fading]
  );

  const next = useCallback(() => {
    goTo((current + 1) % testimonials.length);
  }, [current, goTo, testimonials.length]);

  const prev = useCallback(() => {
    goTo((current - 1 + testimonials.length) % testimonials.length);
  }, [current, goTo, testimonials.length]);

  // Auto-rotate every 6 seconds
  useEffect(() => {
    if (testimonials.length <= 1) return;
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [next, testimonials.length]);

  if (testimonials.length === 0) return null;

  const active = testimonials[current];

  return (
    <section id="testimonials" className="bg-navy py-20 lg:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-heading text-warm-white text-3xl sm:text-4xl font-bold mb-4">
            What Clients Say
          </h2>
          <div className="w-16 h-1 bg-gold mx-auto" aria-hidden="true" />
        </div>

        {/* Card */}
        <div className="relative">
          <div
            className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 sm:p-12 text-center transition-opacity duration-300 ${
              fading ? "opacity-0" : "opacity-100"
            }`}
            aria-live="polite"
            aria-atomic="true"
          >
            <svg
              className="w-10 h-10 text-gold/40 mx-auto mb-6"
              fill="currentColor"
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <path d="M10 8C5.6 8 2 11.6 2 16s3.6 8 8 8h1v4l5-4.6c2.8-1.1 5-3.8 5-6.7 0-5.1-4.9-8.7-11-8.7zm12 0c-1.2 0-2.4.2-3.5.5C20.1 10 22 12.8 22 16c0 2.4-1 4.6-2.7 6.2L22 25v-1h1c4.4 0 8-3.6 8-8s-3.6-8-9-8z" />
            </svg>

            <blockquote className="font-body text-warm-white/90 text-base sm:text-lg leading-relaxed mb-8 italic">
              &ldquo;{active.quote}&rdquo;
            </blockquote>

            <div>
              <p className="font-heading text-gold font-bold text-lg">
                {active.client_name}
              </p>
              <p className="font-body text-warm-white/60 text-sm mt-1">
                {active.company}
              </p>
            </div>
          </div>

          {/* Arrow buttons */}
          {testimonials.length > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-8 w-10 h-10 rounded-full bg-white/10 hover:bg-gold/20 flex items-center justify-center text-warm-white transition-colors focus:outline-none focus:ring-2 focus:ring-gold"
                aria-label="Previous testimonial"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={next}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-8 w-10 h-10 rounded-full bg-white/10 hover:bg-gold/20 flex items-center justify-center text-warm-white transition-colors focus:outline-none focus:ring-2 focus:ring-gold"
                aria-label="Next testimonial"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Dots */}
        {testimonials.length > 1 && (
          <div className="flex justify-center gap-2 mt-8" role="tablist" aria-label="Testimonial navigation">
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === current}
                aria-label={`Go to testimonial ${i + 1}`}
                onClick={() => goTo(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold ${
                  i === current ? "bg-gold scale-125" : "bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
