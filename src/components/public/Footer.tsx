interface FooterProps {
  phone: string;
  email: string;
}

export function Footer({ phone, email }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy py-10 border-t border-navy-light">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="font-heading text-gold text-xl font-bold tracking-widest mb-1">
              SWEIS
            </p>
            <p className="font-body text-warm-white/60 text-xs">
              Professional Bookkeeping Services — Las Vegas, NV
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            {phone && (
              <a
                href={`tel:${phone.replace(/\D/g, "")}`}
                className="font-body text-warm-white/80 hover:text-gold text-sm transition-colors flex items-center gap-2"
                aria-label={`Call ${phone}`}
              >
                <svg className="w-4 h-4 text-gold/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                {phone}
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="font-body text-warm-white/80 hover:text-gold text-sm transition-colors flex items-center gap-2"
                aria-label={`Email ${email}`}
              >
                <svg className="w-4 h-4 text-gold/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                {email}
              </a>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="font-body text-warm-white/40 text-xs">
            &copy; {year} Sweis Bookkeeping Services. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
