import Image from "next/image";

interface AboutProps {
  heading: string;
  text1: string;
  text2: string;
  bookkeepingHeading: string;
  bookkeepingText: string;
  services: string[];
  footnote: string;
  headshotUrl: string;
}

export function About({
  heading,
  text1,
  text2,
  bookkeepingHeading,
  bookkeepingText,
  services,
  footnote,
  headshotUrl,
}: AboutProps) {
  return (
    <section id="about" className="bg-cool-gray py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* About Me subsection */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 mb-20">
          {/* Headshot */}
          <div className="flex-shrink-0">
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-full overflow-hidden shadow-xl ring-4 ring-gold/30">
              <Image
                src={headshotUrl}
                alt="Hanna Sweis, professional bookkeeper"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 224px, (max-width: 1024px) 256px, 288px"
                priority
              />
            </div>
          </div>

          {/* Bio text */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="font-heading text-navy text-3xl sm:text-4xl font-bold mb-6">
              {heading}
            </h2>
            <p className="font-body text-text-primary text-base sm:text-lg leading-relaxed mb-4">
              {text1}
            </p>
            <p className="font-body text-text-primary text-base sm:text-lg leading-relaxed">
              {text2}
            </p>
          </div>
        </div>

        {/* Bookkeeping subsection */}
        <div className="bg-warm-white rounded-2xl p-8 sm:p-10 shadow-sm">
          <h2 className="font-heading text-navy text-3xl sm:text-4xl font-bold mb-6 text-center">
            {bookkeepingHeading}
          </h2>
          <p className="font-body text-text-primary text-base sm:text-lg leading-relaxed mb-8 max-w-3xl mx-auto text-center">
            {bookkeepingText}
          </p>

          <div className="max-w-2xl mx-auto">
            <ul className="space-y-3" aria-label="Services offered">
              {services.map((service, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 font-body text-text-primary text-sm sm:text-base"
                >
                  <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center" aria-hidden="true">
                    <svg className="w-3 h-3 text-gold" viewBox="0 0 12 12" fill="currentColor">
                      <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                    </svg>
                  </span>
                  {service}
                </li>
              ))}
            </ul>

            {footnote && (
              <p className="mt-6 font-body text-text-secondary text-xs sm:text-sm italic border-t border-gray-200 pt-4">
                {footnote}
              </p>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
