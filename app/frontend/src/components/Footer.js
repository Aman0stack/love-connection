import { Heart, PenLine, QrCode, Sparkles } from "lucide-react";
import EditableText from "./EditableText";

export default function Footer({
  names,
  onEditNames,
  onOpenQr,
  isOwner,
  onOpenStoryEditor,
  texts,
  onSaveText,
}) {
  const footerTagline =
    texts?.footerTagline || "Handcrafted with boundless love • vow locked";

  return (
    <footer
      data-testid="keepsake-footer"
      className="relative border-t border-deeprose/15 bg-blush/40 backdrop-blur py-10 sm:py-14"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-8 flex flex-col items-center gap-4 sm:gap-5 text-center">
        <span className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-deeprose text-cream flex items-center justify-center shadow-[0_10px_25px_rgba(214,51,108,0.4)]">
          <Heart size={16} fill="currentColor" strokeWidth={0} />
        </span>
        <p className="font-serif italic text-xl sm:text-2xl text-plum">
          {names.sender} <span className="text-deeprose not-italic">♥</span> {names.recipient}
        </p>
        <p className="text-[11px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] font-mono text-plum/50 max-w-md">
          <EditableText
            value={footerTagline}
            textKey="footerTagline"
            isOwner={isOwner}
            onSave={onSaveText}
            label="Footer tagline"
          />{" "}
          {new Date().getFullYear()}
        </p>

        <div className="flex items-center gap-2.5 mt-2 flex-wrap justify-center">
          {/* ALWAYS VISIBLE LOVE QR BUTTON IN FOOTER */}
          <button
            type="button"
            onClick={onOpenQr}
            data-testid="footer-qr-button"
            className="inline-flex items-center gap-2 rounded-full bg-deeprose px-5 py-2.5 text-xs font-mono tracking-wider text-cream hover:bg-[#b82357] shadow-sm transition-all duration-300"
          >
            <QrCode size={13} />
            <span>Generate Love QR</span>
          </button>

          {/* Owner options in Footer */}
          {isOwner && (
            <>
              {onOpenStoryEditor && (
                <button
                  type="button"
                  onClick={onOpenStoryEditor}
                  data-testid="footer-story-button"
                  className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/80 px-4 py-2.5 text-xs font-mono tracking-wider text-deeprose hover:bg-gold/10 transition-colors duration-300 shadow-sm"
                >
                  <Sparkles size={12} className="text-gold" />
                  <span>Customize Story Texts</span>
                </button>
              )}

              <button
                type="button"
                onClick={onEditNames}
                data-testid="footer-edit-names-button"
                className="inline-flex items-center gap-1.5 rounded-full border border-deeprose/25 bg-white/70 px-4 py-2.5 text-xs font-mono tracking-wider text-deeprose hover:bg-blush transition-colors duration-300"
              >
                <PenLine size={12} />
                <span>Names &amp; Vow</span>
              </button>
            </>
          )}
        </div>
      </div>
    </footer>
  );
}
