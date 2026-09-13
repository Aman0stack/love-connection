import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function NamesModal({ open, names, onSave, onClose }) {
  const [sender, setSender] = useState(names.sender);
  const [recipient, setRecipient] = useState(names.recipient);
  const [proposalNote, setProposalNote] = useState(
    names.proposalNote || "Every heartbeat, every dawn, every ordinary Tuesday — I want them all with you."
  );

  useEffect(() => {
    if (open) {
      setSender(names.sender);
      setRecipient(names.recipient);
      setProposalNote(
        names.proposalNote || "Every heartbeat, every dawn, every ordinary Tuesday — I want them all with you."
      );
    }
  }, [open, names]);

  const save = () => {
    onSave({
      sender: sender.trim() || names.sender,
      recipient: recipient.trim() || names.recipient,
      proposalNote:
        proposalNote.trim() ||
        names.proposalNote ||
        "Every heartbeat, every dawn, every ordinary Tuesday — I want them all with you.",
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-plum/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            data-testid="names-config-modal"
            initial={{ scale: 0.92, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 12, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="w-full max-w-md rounded-3xl bg-cream border border-rose/25 shadow-[0_30px_80px_rgba(92,42,59,0.25)] p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 text-deeprose mb-2">
              <Heart size={14} fill="currentColor" strokeWidth={0} />
              <span className="text-xs uppercase tracking-[0.25em] font-mono">
                Personalize this letter
              </span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-plum mb-6">
              Whose names shall grace this vow?
            </h3>
            <label className="block mb-4">
              <span className="text-xs uppercase tracking-[0.2em] font-mono text-plum/60">
                From — your name
              </span>
              <input
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                data-testid="sender-name-input"
                maxLength={30}
                className="mt-1.5 w-full rounded-xl border border-deeprose/25 bg-white px-4 py-3 font-serif text-lg text-plum outline-none focus:border-deeprose focus:ring-2 focus:ring-rose/30 transition"
              />
            </label>
            <label className="block mb-7">
              <span className="text-xs uppercase tracking-[0.2em] font-mono text-plum/60">
                To — their name
              </span>
              <input
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                data-testid="recipient-name-input"
                maxLength={30}
                className="mt-1.5 w-full rounded-xl border border-deeprose/25 bg-white px-4 py-3 font-serif text-lg text-plum outline-none focus:border-deeprose focus:ring-2 focus:ring-rose/30 transition"
              />
            </label>
            <label className="block mb-7">
              <span className="text-xs uppercase tracking-[0.2em] font-mono text-plum/60">
                Your Proposal Vow / Love Note
              </span>
              <textarea
                value={proposalNote}
                onChange={(e) => setProposalNote(e.target.value)}
                data-testid="proposal-note-input"
                rows={3}
                maxLength={220}
                placeholder="Every heartbeat, every dawn, every ordinary Tuesday — I want them all with you."
                className="mt-1.5 w-full rounded-xl border border-deeprose/25 bg-white px-4 py-3 font-serif italic text-base text-plum outline-none focus:border-deeprose focus:ring-2 focus:ring-rose/30 transition resize-none"
              />
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={save}
                data-testid="names-save-button"
                className="flex-1 rounded-full bg-deeprose text-cream py-3 text-sm font-semibold tracking-wide hover:bg-plum transition-colors duration-300 shadow-[0_10px_24px_rgba(214,51,108,0.35)]"
              >
                Seal the names
              </button>
              <button
                type="button"
                onClick={onClose}
                data-testid="names-cancel-button"
                className="rounded-full border border-plum/20 px-6 py-3 text-sm text-plum/70 hover:bg-blush/60 transition-colors duration-300"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
