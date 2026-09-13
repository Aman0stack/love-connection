import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { Heart, ArrowDown } from "lucide-react";
import EditableText from "./EditableText";

const HERO_IMG =
  "https://images.unsplash.com/photo-1614991539310-630818071643?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDR8MHwxfHNlYXJjaHwzfHxyb21hbnRpYyUyMHZpbnRhZ2UlMjBsZXR0ZXIlMjByb3Nlc3xlbnwwfHx8fDE3ODkyNTYyNzF8MA&ixlib=rb-4.1.0&q=85";

const RevealLine = ({ children, delay }) => (
  <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
    <motion.span
      className="block will-change-transform"
      initial={{ y: "112%" }}
      animate={{ y: "0%" }}
      transition={{ duration: 1.15, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.span>
  </span>
);

export default function Hero({ names, texts, isOwner, onSaveText }) {
  const cardRef = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 120, damping: 16 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), { stiffness: 120, damping: 16 });
  const { scrollY } = useScroll();
  const cardY = useTransform(scrollY, [0, 700], [0, -70]);
  const textY = useTransform(scrollY, [0, 700], [0, 50]);

  const onMove = (e) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const scrollDown = () => {
    if (window.__lenis) window.__lenis.scrollTo("#manifesto", { offset: -40, duration: 1.6 });
    else document.querySelector("#manifesto")?.scrollIntoView({ behavior: "smooth" });
  };

  const line1 = texts?.heroTitle1 || "In all the world,";
  const line2 = texts?.heroTitle2 || "there is no heart";
  const line3 = texts?.heroTitle3 || "for me like yours.";
  const sealText = texts?.heroSealText || "AN ODE TO LIFELONG DEVOTION • EST. FOREVER •";
  const cardTag = texts?.heroCardTag || "postmarked with love";

  return (
    <section
      id="hero"
      data-testid="hero-section"
      className="relative min-h-[90vh] sm:min-h-screen flex items-center pt-20 sm:pt-24 pb-12 sm:pb-16 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-8 w-full grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        <motion.div style={{ y: textY }} className="lg:col-span-7 relative z-10 text-center lg:text-left">
          {/* Animated Wax Seal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-20 h-20 sm:w-24 sm:h-24 mb-6 sm:mb-10 mx-auto lg:mx-0"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow text-deeprose/80">
              <defs>
                <path
                  id="seal-circle"
                  d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"
                  fill="none"
                />
              </defs>
              <text fontSize="8.2" letterSpacing="2.1" fill="currentColor" fontFamily="JetBrains Mono, monospace">
                <textPath href="#seal-circle">{sealText}</textPath>
              </text>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-deeprose">
              <Heart size={20} fill="currentColor" strokeWidth={0} />
            </span>
          </motion.div>

          {/* Hero Headlines */}
          <h1
            data-testid="hero-title-reveal"
            className="font-serif font-bold tracking-tight leading-[1.1] text-3xl xs:text-4xl sm:text-5xl lg:text-6xl text-plum"
          >
            <RevealLine delay={0.35}>
              <EditableText
                value={line1}
                textKey="heroTitle1"
                isOwner={isOwner}
                onSave={onSaveText}
                label="Hero title 1"
              />
            </RevealLine>
            <RevealLine delay={0.5}>
              <EditableText
                value={line2}
                textKey="heroTitle2"
                isOwner={isOwner}
                onSave={onSaveText}
                label="Hero title 2"
              />
            </RevealLine>
            <RevealLine delay={0.65}>
              <EditableText
                value={line3}
                textKey="heroTitle3"
                isOwner={isOwner}
                onSave={onSaveText}
                label="Hero title 3"
                className="text-deeprose font-serif italic"
              />
            </RevealLine>
          </h1>

          {/* Names Tribute */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 sm:mt-10 flex items-center justify-center lg:justify-start gap-4"
            data-testid="hero-names-tribute"
          >
            <span className="h-px w-8 sm:w-10 bg-gold" />
            <p className="text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] font-mono text-deeprose/90">
              {names.sender} &amp; {names.recipient}
            </p>
            <span className="h-px w-8 sm:w-10 bg-gold" />
          </motion.div>

          <motion.button
            type="button"
            onClick={scrollDown}
            data-testid="hero-cta-scroll"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.25, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 sm:mt-12 group inline-flex items-center gap-3 rounded-full border border-deeprose/30 bg-white/70 backdrop-blur px-6 py-3 text-xs sm:text-sm font-semibold text-plum hover:bg-blush transition-colors duration-300 shadow-sm"
          >
            <span>Begin the letter</span>
            <span className="w-6 h-6 rounded-full bg-deeprose text-cream flex items-center justify-center animate-bounce-slow">
              <ArrowDown size={13} />
            </span>
          </motion.button>
        </motion.div>

        {/* 3D Love Letter Card */}
        <div className="lg:col-span-5 relative z-10" style={{ perspective: 1000 }}>
          <motion.div
            ref={cardRef}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            style={{ rotateX: rx, rotateY: ry, y: cardY, transformStyle: "preserve-3d" }}
            initial={{ opacity: 0, y: 60, rotate: 4 }}
            animate={{ opacity: 1, y: 0, rotate: 3 }}
            transition={{ duration: 1.3, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            data-testid="hero-letter-card"
            className="relative mx-auto max-w-[280px] sm:max-w-sm rounded-[1.75rem] border border-rose/25 bg-white/85 backdrop-blur-xl p-3.5 sm:p-4 shadow-[0_35px_90px_-20px_rgba(92,42,59,0.35)]"
          >
            <div className="overflow-hidden rounded-2xl">
              <img
                src={HERO_IMG}
                alt="Pink roses resting upon vintage handwritten love letters"
                className="w-full aspect-[4/5] object-cover"
                loading="eager"
              />
            </div>
            <div className="flex items-center justify-between px-2 pt-3.5 pb-1">
              <EditableText
                value={cardTag}
                textKey="heroCardTag"
                isOwner={isOwner}
                onSave={onSaveText}
                label="Card tag"
                className="font-serif italic text-xs sm:text-sm text-plum/80"
              />
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-mono text-gold border border-gold/50 rounded px-2 py-0.5 rotate-2">
                First Class
              </span>
            </div>
            <motion.span
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -left-4 rounded-full bg-deeprose text-cream text-[9px] sm:text-[10px] font-mono tracking-[0.2em] uppercase px-3.5 py-1.5 shadow-[0_12px_28px_rgba(214,51,108,0.45)]"
              style={{ transform: "translateZ(50px)" }}
            >
              est. forever
            </motion.span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
