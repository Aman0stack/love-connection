const VOWS = [
  "In every lifetime",
  "Hand in hand through the seasons",
  "Through quiet dawns & golden sunsets",
  "Patient",
  "Unconditional",
  "Always yours",
];

export default function Marquee() {
  const items = [...VOWS, ...VOWS];
  return (
    <section data-testid="editorial-marquee" aria-hidden="true" className="relative py-8 -rotate-1 select-none">
      <div className="overflow-hidden border-y border-deeprose/15 bg-blush/60 backdrop-blur py-5">
        <div className="flex w-max animate-marquee">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center">
              {items.map((v, i) => (
                <span key={`${dup}-${i}`} className="flex items-center">
                  <span className="mx-8 font-serif italic text-xl sm:text-2xl text-plum/80 whitespace-nowrap">
                    {v}
                  </span>
                  <span className="text-gold text-sm">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
