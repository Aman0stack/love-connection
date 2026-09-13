import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, PenLine, QrCode, Camera, Lock, KeyRound, Sparkles } from "lucide-react";

const LINKS = [
  { label: "Our Story", to: "#hero" },
  { label: "Manifesto", to: "#manifesto" },
  { label: "Memories", to: "#gallery" },
  { label: "Forever", to: "#the-question" },
];

export default function Header({
  names,
  musicOn,
  onToggleMusic,
  onEditNames,
  onOpenQr,
  onOpenUpload,
  user,
  onOpenLogin,
  isOwner,
  onOpenStoryEditor,
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (e, to) => {
    e.preventDefault();
    if (window.__lenis) {
      window.__lenis.scrollTo(to, { offset: -64, duration: 1.4 });
    } else {
      document.querySelector(to)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const initials = `${(names.sender?.[0] || "R").toUpperCase()} ♥ ${(names.recipient?.[0] || "J").toUpperCase()}`;

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      data-testid="header-navbar"
      className={`fixed top-0 inset-x-0 z-50 transition-[background-color,box-shadow,border-color] duration-500 ${
        scrolled
          ? "bg-white/85 backdrop-blur-xl shadow-[0_8px_32px_rgba(92,42,59,0.08)] border-b border-rose/20"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        <a
          href="#hero"
          onClick={(e) => go(e, "#hero")}
          data-testid="brand-seal-link"
          className="flex items-center gap-1.5 sm:gap-2 group flex-shrink-0"
        >
          <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-deeprose text-cream flex items-center justify-center shadow-[0_6px_16px_rgba(214,51,108,0.35)] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
            <Heart size={15} fill="currentColor" strokeWidth={0} />
          </span>
          <span className="font-serif italic text-sm sm:text-lg text-plum hidden xs:inline tracking-tight">
            forever &amp; always
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-7">
          {LINKS.map((l) => (
            <a
              key={l.to}
              href={l.to}
              onClick={(e) => go(e, l.to)}
              data-testid={`nav-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-xs uppercase tracking-[0.2em] font-mono text-plum/70 hover:text-deeprose transition-colors duration-300"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-nowrap">
          {/* ALWAYS VISIBLE LOVE QR BUTTON */}
          <button
            type="button"
            onClick={onOpenQr}
            data-testid="qr-modal-trigger"
            title="Create lovely QR Code for your partner"
            className="flex items-center gap-1 sm:gap-1.5 rounded-full bg-deeprose text-cream px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-mono tracking-wider hover:bg-[#b82357] shadow-[0_4px_14px_rgba(214,51,108,0.35)] transition-all duration-300 flex-shrink-0"
          >
            <QrCode size={13} />
            <span className="font-semibold">Love QR</span>
          </button>

          {/* Site Owner Controls */}
          {isOwner && (
            <>
              {onOpenStoryEditor && (
                <button
                  type="button"
                  onClick={onOpenStoryEditor}
                  data-testid="story-editor-trigger"
                  title="Customize every word across the website"
                  className="flex items-center gap-1 sm:gap-1.5 rounded-full border border-gold/40 bg-white/80 backdrop-blur px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-mono tracking-wider text-deeprose hover:bg-gold/10 transition-colors shadow-sm flex-shrink-0"
                >
                  <Sparkles size={12} className="text-gold" />
                  <span className="hidden sm:inline">Story Studio</span>
                  <span className="sm:hidden">Edit</span>
                </button>
              )}

              <button
                type="button"
                onClick={onOpenUpload}
                data-testid="photo-upload-trigger"
                title="Upload photo to your scrapbook"
                className="hidden md:flex items-center gap-1.5 rounded-full border border-deeprose/25 bg-white/70 backdrop-blur px-3 py-1.5 sm:py-2 text-xs font-mono tracking-widest text-deeprose hover:bg-blush transition-colors duration-300 flex-shrink-0"
              >
                <Camera size={13} />
                <span>Add Photo</span>
              </button>
            </>
          )}

          {/* Initials Badge: clickable for owner to edit names */}
          {isOwner ? (
            <button
              type="button"
              onClick={onEditNames}
              data-testid="names-edit-trigger"
              title="Edit couple names & vows"
              className="flex items-center gap-1 rounded-full border border-deeprose/25 bg-white/70 backdrop-blur px-2 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-mono tracking-wider text-deeprose hover:bg-blush transition-colors duration-300 flex-shrink-0"
            >
              <PenLine size={11} />
              <span>{initials}</span>
            </button>
          ) : (
            <span
              data-testid="names-static-badge"
              className="hidden xs:flex items-center gap-1 rounded-full border border-deeprose/20 bg-white/60 backdrop-blur px-2 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-mono tracking-wider text-deeprose select-none shadow-sm flex-shrink-0"
            >
              <Heart size={10} fill="currentColor" strokeWidth={0} />
              <span>{initials}</span>
            </span>
          )}

          {/* Music Toggle */}
          <button
            type="button"
            onClick={onToggleMusic}
            data-testid="audio-toggle-button"
            aria-label={musicOn ? "Mute music" : "Play music"}
            className="flex items-center gap-1 rounded-full border border-deeprose/25 bg-white/70 backdrop-blur px-2 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-mono tracking-wider text-deeprose hover:bg-blush transition-colors duration-300 flex-shrink-0"
          >
            <span className="flex items-end gap-[2px] h-3.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={`w-[2.5px] rounded-full bg-deeprose ${musicOn ? "animate-eq" : "h-[3px]"}`}
                  style={musicOn ? { animationDelay: `${i * 0.15}s` } : undefined}
                />
              ))}
            </span>
            <span className="hidden xs:inline">{musicOn ? "on" : "music"}</span>
          </button>

          {/* Login / User Avatar */}
          <button
            type="button"
            onClick={onOpenLogin}
            data-testid="login-trigger-button"
            title={user ? `Logged in as ${user.username}` : "Lover Portal Login"}
            className={`flex items-center gap-1 rounded-full px-2 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-mono tracking-wider transition-all duration-300 flex-shrink-0 ${
              user
                ? "border border-green-500/40 bg-green-50/80 text-green-700 shadow-sm"
                : "border border-deeprose/25 bg-white/70 backdrop-blur text-deeprose hover:bg-blush"
            }`}
          >
            {user ? <KeyRound size={11} className="text-green-600" /> : <Lock size={11} />}
            <span className="truncate max-w-[65px] sm:max-w-[100px]">{user ? user.username : "Login"}</span>
          </button>
        </div>
      </div>
    </motion.header>
  );
}
