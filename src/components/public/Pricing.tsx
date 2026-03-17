interface PricingTier {
  id: number;
  name: string;
  price: number;
  features: string[];
  sort_order: number;
}

interface PricingNote {
  id: number;
  text: string;
  sort_order: number;
}

interface PricingProps {
  tiers: PricingTier[];
  notes: PricingNote[];
}

const TIER_STYLES: Record<string, { header: string; ring: string; badge?: boolean }> = {
  Silver: {
    header: "bg-silver text-navy",
    ring: "ring-silver/50",
  },
  Gold: {
    header: "bg-gold text-navy",
    ring: "ring-gold/50",
    badge: true,
  },
  Platinum: {
    header: "bg-platinum text-navy",
    ring: "ring-platinum/50",
  },
};

function getStyle(name: string) {
  return (
    TIER_STYLES[name] ?? {
      header: "bg-navy text-warm-white",
      ring: "ring-navy/30",
    }
  );
}

export function Pricing({ tiers, notes }: PricingProps) {
  return (
    <section id="pricing" className="bg-warm-white py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-heading text-navy text-3xl sm:text-4xl font-bold mb-4">
            Pricing
          </h2>
          <p className="font-body text-text-secondary text-base sm:text-lg max-w-xl mx-auto">
            Transparent, flat-rate pricing tailored to your business needs.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
          {tiers.map((tier) => {
            const style = getStyle(tier.name);
            const isFeatured = style.badge;

            return (
              <div
                key={tier.id}
                className={`relative flex flex-col transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  isFeatured ? "md:-mt-4 md:shadow-xl" : ""
                }`}
              >
                {isFeatured && (
                  <div className="flex justify-center">
                    <span className="font-body text-xs font-semibold bg-gold text-navy px-4 py-1 rounded-t-lg tracking-wider uppercase">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className={`flex flex-col flex-1 rounded-2xl shadow-md ring-1 overflow-hidden ${style.ring}`}>

                {/* Card header */}
                <div className={`${style.header} px-6 py-6 text-center`}>
                  <h3 className="font-heading text-2xl font-bold tracking-wide mb-1">
                    {tier.name}
                  </h3>
                  <p className="font-body text-sm font-medium opacity-80">
                    Starting at
                  </p>
                  <p className="font-heading text-4xl font-bold mt-1">
                    ${tier.price}
                    <span className="text-base font-normal opacity-70">/mo</span>
                  </p>
                </div>

                {/* Features */}
                <div className="bg-white flex-1 px-6 py-6">
                  <ul className="space-y-3" aria-label={`${tier.name} tier features`}>
                    {tier.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 font-body text-text-primary text-sm"
                      >
                        <span
                          className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-gold/20 flex items-center justify-center"
                          aria-hidden="true"
                        >
                          <svg className="w-2.5 h-2.5 text-gold" viewBox="0 0 12 12" fill="currentColor">
                            <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                          </svg>
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Notes */}
        {notes.length > 0 && (
          <div className="mt-12 max-w-2xl mx-auto">
            <ul className="space-y-2" aria-label="Pricing notes">
              {notes.map((note, i) => (
                <li
                  key={note.id}
                  className="font-body text-text-secondary text-sm flex items-start gap-2"
                >
                  <span className="text-gold font-bold flex-shrink-0">{i + 1}.</span>
                  {note.text}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
