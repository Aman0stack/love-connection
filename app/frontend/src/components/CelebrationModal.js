import { AnimatePresence, motion } from "framer-motion";
import { Heart, X, Sparkles } from "lucide-react";

const KEEPSAKE_IMG =
  "https://images.unsplash.com/photo-1575388104683-e076ee9ccaa0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwyfHxjb3VwbGUlMjBob2xkaW5nJTIwaGFuZHMlMjBzdW5zZXQlMjByb21hbnNlfGVufDB8fHx8MTc4OTI1NjI4Mnww&ixlib=rb-4.1.0&q=85";

export default function CelebrationModal({ open, names, texts, onClose, onReplay }) {
  const today = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const celebrationTitle = texts?.celebrationTitle || "Forever, then.";
  const celebrationMessage =
    texts?.celebrationMessage ||
    `Dearest ${names.recipient}, you said yes — and just like that, every tomorrow became a promise. I will love you through quiet dawns and golden sunsets, in this lifetime and every one after.`;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-8 bg-plum/55 backdrop-blur-md overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            data-testid="celebration-modal"
            initial={{ scale: 0.88, y: 44, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.94, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] bg-cream border border-gold/40 shadow-[0_50px_120px_-30px_rgba(92,42,59,0.6)] p-6 sm:p-12 text-center my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              data-testid="celebration-close-button"
              aria-label="Close celebration"
              className="absolute top-4 right-4 sm:top-5 sm:right-5 w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-plum/15 bg-white/80 flex items-center justify-center text-plum/60 hover:bg-blush transition-colors"
            >
              <X size={16} />
            </button>

            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.2 }}
              className="mx-auto w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-deeprose text-cream flex items-center justify-center shadow-[0_14px_35px_rgba(214,51,108,0.5)] mb-4 sm:mb-6"
            >
              <Heart size={24} fill="currentColor" strokeWidth={0} />
            </motion.div>

            <p className="text-xs uppercase tracking-[0.35em] font-mono text-gold mb-2 sm:mb-3">
              The answer is yes
            </p>
            <h2 className="font-serif font-bold text-3xl sm:text-5xl text-plum mb-4 sm:mb-6">
              {celebrationTitle}
            </h2>

            <div className="overflow-hidden rounded-2xl border border-rose/20 mb-5 sm:mb-7">
              <img
                src={KEEPSAKE_IMG}
                alt="Couple strolling along the shoreline under a pastel sunset"
                className="w-full aspect-[16/8] object-cover"
              />
            </div>

            <p className="font-serif italic text-base sm:text-xl leading-relaxed text-plum/85 max-w-lg mx-auto">
              {celebrationMessage}
            </p>
            <p className="mt-4 sm:mt-5 font-serif italic text-base sm:text-lg text-plum">— {names.sender}</p>

            <div className="mt-6 sm:mt-8 inline-flex items-center gap-2 sm:gap-3 rounded-full border border-gold/50 bg-white/80 px-4 sm:px-6 py-2 sm:py-3">
              <Sparkles size={13} className="text-gold" />
              <span
                data-testid="celebration-date-stamp"
                className="text-[11px] sm:text-xs uppercase tracking-[0.2em] font-mono text-deeprose"
              >
                Day 1 of forever — {today}
              </span>
            </div>

            <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={onReplay}
                data-testid="celebration-replay-button"
                className="rounded-full bg-deeprose text-cream px-6 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold hover:bg-plum transition-colors duration-300 shadow-[0_12px_30px_rgba(214,51,108,0.4)]"
              >
                Replay the magic
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-plum/20 px-5 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm text-plum/70 hover:bg-blush/60 transition-colors duration-300"
              >
                Keep scrolling
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
