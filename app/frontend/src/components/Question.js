import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import EditableText from "./EditableText";

const QUIPS = [
  "Are you sure?",
  "Wait… think of the snacks!",
  "Error 404: ‘No’ not found",
  "Nice try, speedy!",
  "My heart says please",
  "You can’t escape my love",
  "I’ll tickle you forever",
  "Look over there — it’s Yes!",
];

const PAD = 16;

export default function Question({
  names,
  onYes,
  isOwner,
  onEditNames,
  texts,
  onSaveText,
}) {
  const stageRef = useRef(null);
  const yesRef = useRef(null);
  const noRef = useRef(null);
  const [measured, setMeasured] = useState(false);
  const [yesPos, setYesPos] = useState({ x: 0, y: 0 });
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [escapes, setEscapes] = useState(0);
  const noPosRef = useRef(noPos);
  const noSizeRef = useRef({ w: 120, h: 50 });

  useEffect(() => {
    noPosRef.current = noPos;
  }, [noPos]);

  const measure = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const r = stage.getBoundingClientRect();
    const isMobile = r.width < 540;

    let yw = 180;
    let nw = 110;
    let nh = 50;

    if (yesRef.current) {
      yw = yesRef.current.getBoundingClientRect().width || 180;
    }
    if (noRef.current) {
      const nr = noRef.current.getBoundingClientRect();
      nw = nr.width || 110;
      nh = nr.height || 50;
      noSizeRef.current = { w: nw, h: nh };
    }

    if (isMobile) {
      // Stacked layout on mobile for comfortable touch space
      setYesPos({ x: Math.max(PAD, (r.width - yw) / 2), y: r.height * 0.28 });
      const home = { x: Math.max(PAD, (r.width - nw) / 2), y: r.height * 0.68 };
      setNoPos((prev) => {
        const clamped = {
          x: Math.min(Math.max(prev.x, PAD), Math.max(PAD, r.width - nw - PAD)),
          y: Math.min(Math.max(prev.y, PAD), Math.max(PAD, r.height - nh - PAD)),
        };
        return noPosRef.current.escaped ? clamped : home;
      });
    } else {
      // Side-by-side on tablet/desktop
      setYesPos({ x: r.width / 2 - yw - 24, y: r.height * 0.52 });
      const home = { x: r.width / 2 + 24, y: r.height * 0.52 };
      setNoPos((prev) => {
        const clamped = {
          x: Math.min(Math.max(prev.x, PAD), Math.max(PAD, r.width - nw - PAD)),
          y: Math.min(Math.max(prev.y, PAD), Math.max(PAD, r.height - nh - PAD)),
        };
        return noPosRef.current.escaped ? clamped : home;
      });
    }

    setMeasured(true);
  }, []);

  useLayoutEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const dodge = useCallback(
    (px, py) => {
      const stage = stageRef.current;
      if (!stage) return;
      const r = stage.getBoundingClientRect();
      const { w: bw, h: bh } = noSizeRef.current;
      let best = null;
      for (let i = 0; i < 12; i += 1) {
        const x = PAD + Math.random() * Math.max(1, r.width - bw - PAD * 2);
        const y = PAD + Math.random() * Math.max(1, r.height - bh - PAD * 2);
        const dist = Math.hypot(x + bw / 2 - px, y + bh / 2 - py);
        if (dist > 150) {
          best = { x, y };
          break;
        }
        if (!best || dist > Math.hypot(best.x + bw / 2 - px, best.y + bh / 2 - py)) {
          best = { x, y };
        }
      }
      if (best) {
        setNoPos(best);
        noPosRef.current = { ...best, escaped: true };
      }
      setEscapes((e) => e + 1);
    },
    []
  );

  const onStagePointerMove = (e) => {
    const stage = stageRef.current;
    if (!stage) return;
    const r = stage.getBoundingClientRect();
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;
    const { w: bw, h: bh } = noSizeRef.current;
    const cx = noPosRef.current.x + bw / 2;
    const cy = noPosRef.current.y + bh / 2;
    if (Math.hypot(px - cx, py - cy) < 95) dodge(px, py);
  };

  const yesScale = Math.min(1.25, 1 + escapes * 0.04);
  const noScale = Math.max(0.55, 1 - escapes * 0.04);
  const quip = escapes === 0 ? "There is only one right answer." : QUIPS[(escapes - 1) % QUIPS.length];

  const proposalTitle = texts?.proposalTitle || "Will you love me forever?";
  const proposalNote =
    texts?.proposalNote ||
    names?.proposalNote ||
    "Every heartbeat, every dawn, every ordinary Tuesday — I want them all with you.";
  const yesText = texts?.proposalYesText || "Yes, forever";

  return (
    <section
      id="the-question"
      data-testid="proposal-question-section"
      className="relative mx-auto max-w-5xl px-4 sm:px-8 py-16 sm:py-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-[2rem] border border-deeprose/15 bg-white/80 backdrop-blur-xl shadow-[0_35px_90px_-30px_rgba(92,42,59,0.35)] px-4 sm:px-12 pt-10 sm:pt-14 pb-6 text-center overflow-hidden"
      >
        <p className="text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] font-mono text-deeprose/80 mb-2 sm:mb-3">
          Dearest {names.recipient},
        </p>

        <h2
          data-testid="proposal-title"
          className="font-serif font-bold tracking-tight leading-[1.15] text-3xl sm:text-5xl lg:text-6xl text-plum"
        >
          <EditableText
            value={proposalTitle}
            textKey="proposalTitle"
            isOwner={isOwner}
            onSave={onSaveText}
            label="Proposal question"
          />
        </h2>

        <div className="mt-4 sm:mt-5 max-w-xl mx-auto flex items-center justify-center gap-2 px-2">
          <p className="text-sm sm:text-lg text-plum/75 font-serif italic leading-relaxed">
            <EditableText
              value={proposalNote}
              textKey="proposalNote"
              isOwner={isOwner}
              onSave={onSaveText}
              multiline
              label="Proposal vow / note"
            />
          </p>
        </div>

        <div className="h-9 mt-3 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={quip}
              data-testid="proposal-quip"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={`text-xs sm:text-sm font-mono tracking-wide ${escapes ? "text-deeprose font-semibold" : "text-plum/50"}`}
            >
              {quip}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Interactive Proposal Stage */}
        <div
          ref={stageRef}
          data-testid="proposal-stage"
          onPointerMove={onStagePointerMove}
          className="relative h-[300px] sm:h-[280px] mt-2 select-none"
          style={{ touchAction: "none" }}
        >
          {/* YES Button */}
          <motion.div
            animate={{ x: yesPos.x, y: yesPos.y, scale: yesScale }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="absolute left-0 top-0 z-10"
            style={{ opacity: measured ? 1 : 0 }}
          >
            <motion.button
              ref={yesRef}
              type="button"
              onClick={onYes}
              data-testid="proposal-yes-button"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-deeprose via-rose to-gold px-7 sm:px-10 py-3.5 sm:py-4 text-base sm:text-lg font-bold text-white shadow-[0_18px_45px_-10px_rgba(214,51,108,0.6)] cursor-pointer"
            >
              <Heart size={18} fill="currentColor" strokeWidth={0} />
              <span>{yesText}</span>
            </motion.button>
          </motion.div>

          {/* NO Button (dodges) */}
          <motion.div
            animate={{ x: noPos.x, y: noPos.y, scale: noScale }}
            transition={{ type: "spring", stiffness: 520, damping: 24 }}
            className="absolute left-0 top-0 z-20"
            style={{ opacity: measured ? 1 : 0 }}
          >
            <button
              ref={noRef}
              type="button"
              data-testid="proposal-no-button"
              onPointerEnter={(e) => {
                const r = stageRef.current?.getBoundingClientRect();
                if (r) dodge(e.clientX - r.left, e.clientY - r.top);
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                const t = e.touches[0];
                const r = stageRef.current?.getBoundingClientRect();
                if (r && t) dodge(t.clientX - r.left, t.clientY - r.top);
              }}
              onClick={(e) => {
                e.preventDefault();
                const r = stageRef.current?.getBoundingClientRect();
                if (r) dodge(e.clientX - r.left, e.clientY - r.top);
              }}
              className="rounded-full border-2 border-plum/25 bg-white/95 px-6 sm:px-8 py-2.5 sm:py-3.5 text-sm sm:text-base font-semibold text-plum/60 shadow-md cursor-pointer transition-colors hover:bg-red-50"
            >
              No
            </button>
          </motion.div>
        </div>

        <p className="pb-4 text-xs uppercase tracking-[0.25em] font-mono text-plum/50">
          — {names.sender}
        </p>
      </motion.div>
    </section>
  );
}
