import { motion } from "framer-motion";
import EditableText from "./EditableText";

const CHAPTER_IMAGES = [
  {
    n: "01",
    img: "https://images.unsplash.com/photo-1614991539310-630818071643?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDR8MHwxfHNlYXJjaHwzfHxyb21hbnRpYyUyMHZpbnRhZ2UlMjBsZXR0ZXIlMjByb3Nlc3xlbnwwfHx8fDE3ODkyNTYyNzF8MA&ixlib=rb-4.1.0&q=85",
    alt: "Roses upon vintage love letters",
    span: "lg:col-span-7",
  },
  {
    n: "02",
    img: "https://images.unsplash.com/photo-1766226763072-9c738037df26?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDR8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMHZpbnRhZ2UlMjBsZXR0ZXIlMjByb3Nlc3xlbnwwfHx8fDE3ODkyNTYyNzF8MA&ixlib=rb-4.1.0&q=85",
    alt: "Blush roses blossoming from a craft paper envelope",
    span: "lg:col-span-5",
  },
  {
    n: "03",
    img: "https://images.unsplash.com/photo-1543829969-57899edf981b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjBob2xkaW5nJTIwaGFuZHMlMjBzdW5zZXQlMjByb21hbnNlfGVufDB8fHx8MTc4OTI1NjI4Mnww&ixlib=rb-4.1.0&q=85",
    alt: "Couple holding hands bathed in warm sunset glow",
    span: "lg:col-span-5",
  },
  {
    n: "04",
    img: null,
    span: "lg:col-span-7",
  },
];

const reveal = {
  initial: { opacity: 0, y: 56 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-70px" },
  transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
};

export default function Manifesto({ texts, isOwner, onSaveText }) {
  const manifestoTitle =
    texts?.manifestoTitle ||
    "Four pillars of my love, numbered like chapters of a book without an ending.";

  const chaptersData = [
    {
      ...CHAPTER_IMAGES[0],
      titleKey: "chapter1Title",
      quoteKey: "chapter1Quote",
      title: texts?.chapter1Title || "The Sanctuary of Your Laugh",
      quote:
        texts?.chapter1Quote ||
        "In a noisy world, your voice is my grounding silence. Every heavy day unspools the moment you smile.",
    },
    {
      ...CHAPTER_IMAGES[1],
      titleKey: "chapter2Title",
      quoteKey: "chapter2Quote",
      title: texts?.chapter2Title || "The Everyday Magic",
      quote:
        texts?.chapter2Quote ||
        "Not just the anniversaries, but the Tuesday morning coffees, the warm socks on chilly floors, and the quiet glances across crowded rooms.",
    },
    {
      ...CHAPTER_IMAGES[2],
      titleKey: "chapter3Title",
      quoteKey: "chapter3Quote",
      title: texts?.chapter3Title || "Unshakable Loyalty",
      quote:
        texts?.chapter3Quote ||
        "To be the anchor when storms roll in, and the warm fire when night falls. Through every unknown horizon, I stand beside you.",
    },
    {
      ...CHAPTER_IMAGES[3],
      titleKey: "chapter4Title",
      quoteKey: "chapter4Quote",
      title: texts?.chapter4Title || "The Infinite Horizon",
      quote:
        texts?.chapter4Quote ||
        "Loving you is not a chapter that concludes; it is the entire book, written in ink that outlives the stars.",
    },
  ];

  const statsData = [
    {
      vKey: "metric1Value",
      lKey: "metric1Label",
      val: texts?.metric1Value || "∞",
      label: texts?.metric1Label || "laughs shared & counting",
    },
    {
      vKey: "metric2Value",
      lKey: "metric2Label",
      val: texts?.metric2Value || "10,000+",
      label: texts?.metric2Label || "sunrises still to come",
    },
    {
      vKey: "metric3Value",
      lKey: "metric3Label",
      val: texts?.metric3Value || "1",
      label: texts?.metric3Label || "question that changes everything",
    },
  ];

  return (
    <section
      id="manifesto"
      data-testid="manifesto-section"
      className="relative mx-auto max-w-7xl px-4 sm:px-8 py-16 sm:py-32"
    >
      <motion.div {...reveal} className="mb-12 sm:mb-16 max-w-2xl">
        <p className="text-xs uppercase tracking-[0.3em] font-mono text-deeprose/80 mb-3 sm:mb-4">
          The Manifesto
        </p>
        <h2 className="font-serif font-semibold tracking-tight text-2xl sm:text-3xl lg:text-4xl text-plum leading-snug">
          <EditableText
            value={manifestoTitle}
            textKey="manifestoTitle"
            isOwner={isOwner}
            onSave={onSaveText}
            multiline
            label="Manifesto Headline"
          />
        </h2>
      </motion.div>

      <div className="grid lg:grid-cols-12 gap-5 sm:gap-6">
        {chaptersData.map((c, i) => (
          <motion.article
            key={c.n}
            {...reveal}
            transition={{ ...reveal.transition, delay: (i % 2) * 0.12 }}
            data-testid={`manifesto-chapter-${i + 1}`}
            className={`group relative overflow-hidden rounded-[1.75rem] border border-deeprose/15 bg-white/75 backdrop-blur shadow-[0_20px_50px_-25px_rgba(92,42,59,0.25)] ${c.span}`}
          >
            {c.img ? (
              <div className="overflow-hidden">
                <img
                  src={c.img}
                  alt={c.alt}
                  loading="lazy"
                  className="w-full aspect-[16/7] object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                />
              </div>
            ) : (
              <div className="h-2 bg-gradient-to-r from-gold via-rose to-deeprose" />
            )}
            <div className="relative p-6 sm:p-10">
              <span className="pointer-events-none absolute -top-5 right-4 sm:-top-6 sm:right-6 font-serif text-5xl sm:text-[7rem] leading-none text-blush select-none">
                {c.n}
              </span>
              <p className="text-xs uppercase tracking-[0.3em] font-mono text-gold mb-2 sm:mb-3">
                Chapter {c.n}
              </p>
              <h3 className="font-serif italic text-lg sm:text-2xl text-plum mb-3 sm:mb-4">
                <EditableText
                  value={c.title}
                  textKey={c.titleKey}
                  isOwner={isOwner}
                  onSave={onSaveText}
                  label={`Chapter ${c.n} Title`}
                />
              </h3>
              <p className="text-sm sm:text-lg leading-relaxed text-plum/80 max-w-xl">
                <EditableText
                  value={c.quote}
                  textKey={c.quoteKey}
                  isOwner={isOwner}
                  onSave={onSaveText}
                  multiline
                  label={`Chapter ${c.n} Quote`}
                />
              </p>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Love Metrics Strip */}
      <motion.div
        {...reveal}
        data-testid="love-metrics-strip"
        className="mt-14 sm:mt-20 grid grid-cols-1 xs:grid-cols-3 gap-6 sm:gap-8 border-y border-deeprose/15 py-8 sm:py-10 text-center"
      >
        {statsData.map((stat) => (
          <div key={stat.vKey} className="p-2">
            <p className="font-serif text-3xl sm:text-4xl text-deeprose mb-1.5 sm:mb-2">
              <EditableText
                value={stat.val}
                textKey={stat.vKey}
                isOwner={isOwner}
                onSave={onSaveText}
                label="Metric value"
              />
            </p>
            <p className="text-xs uppercase tracking-[0.25em] font-mono text-plum/60">
              <EditableText
                value={stat.label}
                textKey={stat.lKey}
                isOwner={isOwner}
                onSave={onSaveText}
                label="Metric description"
              />
            </p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
