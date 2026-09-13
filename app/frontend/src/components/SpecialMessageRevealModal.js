import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Volume2, Music, X } from "lucide-react";

export default function SpecialMessageRevealModal({
  open,
  onClose,
  onOpenStory,
  names,
  message,
}) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <div
        data-testid="special-message-reveal-overlay"
        className="fixed inset-0 z-[100] bg-plum/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-lg w-full bg-[#fffaf5] rounded-[2.5rem] p-6 sm:p-10 border-2 border-gold/40 shadow-[0_35px_90px_-20px_rgba(92,42,59,0.55)] text-center my-auto overflow-hidden"
        >
          {/* Subtle close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 text-plum/40 hover:text-deeprose transition-colors p-1"
            title="Close letter"
          >
            <X size={18} />
          </button>

          {/* Glowing Animated Heart Wax Seal */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
            className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-deeprose to-rose text-cream flex items-center justify-center shadow-[0_12px_35px_rgba(214,51,108,0.5)] mb-4 sm:mb-5 relative"
          >
            <Heart size={32} fill="currentColor" strokeWidth={0} />
            <motion.span
              animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2.2, repeat: Infinity }}
              className="absolute inset-0 rounded-full border-2 border-rose/60"
            />
          </motion.div>

          <div className="flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-gold mb-1">
            <Sparkles size={13} className="text-gold animate-pulse" />
            <span>A Private Love Dispatch</span>
            <Sparkles size={13} className="text-gold animate-pulse" />
          </div>

          <h2 className="font-serif font-bold text-2xl sm:text-4xl text-plum leading-tight">
            For My Dearest {names?.recipient || "Love"}
          </h2>

          <p className="text-xs font-mono uppercase tracking-widest text-deeprose/90 mt-1 mb-5">
            Postmarked with devotion by {names?.sender || "Your Romeo"}
          </p>

          {/* Letter Body Parchment */}
          <div className="relative p-5 sm:p-7 rounded-3xl bg-white/90 border border-deeprose/20 shadow-[0_8px_30px_rgba(92,42,59,0.06)] mb-6 text-center">
            {/* Corner flourishes */}
            <span className="absolute top-2 left-3 text-gold/40 font-serif text-lg select-none">❧</span>
            <span className="absolute top-2 right-3 text-gold/40 font-serif text-lg select-none">❧</span>

            <p className="font-serif italic text-base sm:text-xl text-plum/90 leading-relaxed max-w-md mx-auto">
              "{message || "My love, every heartbeat of mine belongs to you. Open this letter to begin our forever story."}"
            </p>

            <span className="block mt-3 text-xs font-mono text-plum/50">
              — Sealed in forever ink ♥
            </span>
          </div>

          {/* Music & Experience Notice */}
          <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-plum/70 mb-5">
            <Music size={13} className="text-deeprose animate-bounce" />
            <span>Tap below to start our romantic song &amp; explore our story</span>
          </div>

          {/* Main Action Button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={onOpenStory}
            data-testid="reveal-open-story-btn"
            className="w-full flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-deeprose via-rose to-gold py-4 px-6 text-sm sm:text-base font-bold text-white shadow-[0_15px_35px_rgba(214,51,108,0.5)] hover:shadow-[0_20px_45px_rgba(214,51,108,0.6)] transition-all cursor-pointer"
          >
            <Heart size={18} fill="currentColor" strokeWidth={0} />
            <span>Open Our Story &amp; Play Song</span>
            <Sparkles size={16} className="text-cream" />
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
