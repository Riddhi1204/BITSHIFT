export const PromoBanner = () => {
  return (
    <section className="pt-24 sm:pt-28 pb-2 sm:pb-4 bg-gradient-to-b from-[#0B1220] via-[#0B1220] to-[#0D1829] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-red-500/20 shadow-2xl shadow-red-950/40 bg-[#070C16] group transition-all duration-300 hover:border-red-500/40 hover:shadow-red-900/40">
          <img
            src="/images/hemovite-banner.jpg"
            alt="HemoVite - Predict. Prevent. Save Lives. Next-Generation Healthcare AI"
            className="w-full h-auto object-cover max-h-[220px] sm:max-h-[320px] md:max-h-[400px] lg:max-h-[460px] transition-transform duration-700 group-hover:scale-[1.01] block"
            loading="eager"
          />
          {/* Subtle ambient gradient overlay and ring */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl sm:rounded-3xl pointer-events-none" />
        </div>
      </div>
    </section>
  );
};
