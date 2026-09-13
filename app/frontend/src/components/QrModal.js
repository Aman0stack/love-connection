import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Heart, Copy, Check, Download, ExternalLink, X, Smartphone, Wifi, Lock, Sparkles, PenLine } from "lucide-react";
import { buildShareUrl } from "../config/photoStorage";

// Heart SVG encoded as data URI for the center of the QR code
const HEART_ICON_DATA_URL = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23d6336c" width="36" height="36"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let currentY = y;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + " ";
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
  return currentY;
}

export default function QrModal({
  open,
  onClose,
  names,
  photos,
  user,
  onOpenLogin,
  texts,
  onSaveText,
}) {
  const [copied, setCopied] = useState(false);
  const [specialMsg, setSpecialMsg] = useState(
    texts?.qrSpecialMessage ||
      "My love, every heartbeat of mine belongs to you. Open this letter to begin our forever story."
  );

  useEffect(() => {
    if (texts?.qrSpecialMessage) {
      setSpecialMsg(texts.qrSpecialMessage);
    }
  }, [texts?.qrSpecialMessage]);

  const currentHost = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  // Default network IP for phone scanning on same Wi-Fi
  const detectedNetworkIp =
    typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1"
      ? window.location.origin
      : "http://192.168.1.111:3000";

  const [hostChoice, setHostChoice] = useState("network"); // 'network' | 'current'
  const qrRef = useRef(null);

  const getBaseHost = () => {
    if (hostChoice === "network") return detectedNetworkIp;
    return currentHost;
  };

  const encodedMsg = encodeURIComponent(specialMsg.trim());
  const shareUrl = user?.username
    ? `${getBaseHost()}/?u=${encodeURIComponent(user.username)}&msg=${encodedMsg}`
    : `${buildShareUrl({
        sender: names?.sender,
        recipient: names?.recipient,
        baseUrl: getBaseHost(),
        customPhotoUrl: photos?.[0]?.url?.startsWith("http") ? photos[0].url : undefined,
      })}&msg=${encodedMsg}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch (e) {
      console.error("Clipboard copy failed:", e);
    }
  };

  const handleDownloadCard = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 680;
    canvas.height = 960;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background parchment
    ctx.fillStyle = "#fff7f3";
    ctx.fillRect(0, 0, 680, 960);

    // Outer vintage border
    ctx.strokeStyle = "#d6336c";
    ctx.lineWidth = 4;
    ctx.strokeRect(24, 24, 632, 912);

    // Inner gold border
    ctx.strokeStyle = "#e3b23c";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(32, 32, 616, 896);

    // Heading
    ctx.fillStyle = "#5c2a3b";
    ctx.font = "bold italic 32px 'Playfair Display', serif";
    ctx.textAlign = "center";
    ctx.fillText("A Love Letter For", 340, 85);

    ctx.fillStyle = "#d6336c";
    ctx.font = "bold 44px 'Playfair Display', serif";
    ctx.fillText(names?.recipient || "Juliet", 340, 140);

    ctx.fillStyle = "#e3b23c";
    ctx.font = "13px 'JetBrains Mono', monospace";
    ctx.fillText(`FROM ${(names?.sender || "Romeo").toUpperCase()} • WITH LIFELONG DEVOTION`, 340, 175);

    // Decorative divider line
    ctx.strokeStyle = "rgba(214, 51, 108, 0.25)";
    ctx.beginPath();
    ctx.moveTo(140, 195);
    ctx.lineTo(540, 195);
    ctx.stroke();

    // SPECIAL MESSAGE BANNER ON CANVAS (ABOVE QR)
    ctx.fillStyle = "rgba(214, 51, 108, 0.08)";
    ctx.roundRect(80, 215, 520, 85, 14);
    ctx.fill();
    ctx.strokeStyle = "rgba(214, 51, 108, 0.3)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#d6336c";
    ctx.font = "bold 11px 'JetBrains Mono', monospace";
    ctx.fillText("♥ SPECIAL MESSAGE EMBEDDED IN QR ♥", 340, 238);

    ctx.fillStyle = "#5c2a3b";
    ctx.font = "italic 16px 'Playfair Display', serif";
    wrapText(ctx, `"${specialMsg}"`, 340, 266, 480, 22);

    // Render QR Code SVG onto canvas
    const svgElement = qrRef.current?.querySelector("svg");
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const URLObj = window.URL || window.webkitURL || window;
      const blobUrl = URLObj.createObjectURL(svgBlob);
      const qrImg = new Image();
      qrImg.onload = () => {
        // Draw white badge for QR
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "rgba(92, 42, 59, 0.15)";
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 10;
        ctx.roundRect(190, 330, 300, 300, 20);
        ctx.fill();
        ctx.shadowColor = "transparent";

        ctx.drawImage(qrImg, 215, 355, 250, 250);
        URLObj.revokeObjectURL(blobUrl);

        // Footer romantic text
        ctx.fillStyle = "#5c2a3b";
        ctx.font = "italic 24px 'Playfair Display', serif";
        ctx.fillText('"Will you love me forever?"', 340, 685);

        ctx.fillStyle = "rgba(92, 42, 59, 0.75)";
        ctx.font = "12px 'JetBrains Mono', monospace";
        ctx.fillText("SCAN WITH YOUR CAMERA TO REVEAL OUR STORY & MUSIC", 340, 735);

        ctx.fillStyle = "#d6336c";
        ctx.font = "bold 14px 'Quicksand', sans-serif";
        ctx.fillText("♥  EST. FOREVER & ALWAYS  ♥", 340, 790);

        // Trigger download
        const link = document.createElement("a");
        link.download = `Love-Dispatch-For-${names?.recipient || "You"}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      };
      qrImg.src = blobUrl;
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div
        data-testid="qr-modal-overlay"
        onClick={onClose}
        className="fixed inset-0 z-50 bg-plum/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 25 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-lg w-full bg-[#fffcf9] rounded-[2rem] p-5 sm:p-7 border border-deeprose/20 shadow-[0_25px_60px_-15px_rgba(214,51,108,0.35)] text-center my-auto overflow-y-auto max-h-[92vh]"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 text-plum/50 hover:text-deeprose transition-colors p-1"
          >
            <X size={20} />
          </button>

          {/* Top Wax Seal Icon */}
          <div className="mx-auto w-11 h-11 rounded-full bg-deeprose text-cream flex items-center justify-center shadow-[0_6px_20px_rgba(214,51,108,0.4)] mb-2">
            <Heart size={18} fill="currentColor" strokeWidth={0} />
          </div>

          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-mono text-gold block mb-0.5">
            Private Love Dispatch
          </span>
          <h3 className="font-serif font-bold text-2xl sm:text-3xl text-plum">
            Scan to Open Our Letter
          </h3>
          <p className="text-xs sm:text-sm text-plum/75 mt-0.5 mb-3">
            Prepared specially for <strong className="text-deeprose">{names?.recipient}</strong> from{" "}
            <strong className="text-plum">{names?.sender}</strong>.
          </p>

          {/* PROMINENT SPECIAL MESSAGE DISPLAY ABOVE THE QR CODE */}
          <div className="mb-3.5 p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-rose/15 via-blush to-gold/15 border border-deeprose/25 text-center shadow-sm">
            <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-deeprose font-semibold mb-1">
              <Sparkles size={12} className="text-gold" />
              <span>Special Message for {names?.recipient}</span>
            </div>
            <p className="font-serif italic text-sm sm:text-base text-plum leading-snug px-1">
              "{specialMsg}"
            </p>
            <span className="block text-[10px] font-mono text-plum/60 mt-1">
              — Above QR &amp; revealed first upon scan
            </span>
          </div>

          {/* Message Customization Input */}
          <div className="mb-3.5 text-left">
            <label className="block text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-plum/70 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <PenLine size={11} className="text-deeprose" />
                <span>Edit Special Message In QR:</span>
              </span>
              <span className="text-[10px] text-deeprose font-semibold">Live in QR</span>
            </label>
            <textarea
              rows={2}
              value={specialMsg}
              onChange={(e) => {
                setSpecialMsg(e.target.value);
                onSaveText?.("qrSpecialMessage", e.target.value);
              }}
              className="w-full rounded-xl border border-deeprose/30 bg-white p-2.5 text-xs sm:text-sm font-serif italic text-plum placeholder:text-plum/40 focus:border-deeprose focus:outline-none shadow-inner resize-y"
              placeholder="Write your special love message here..."
            />
          </div>

          {/* QR Code Container with luxury border */}
          <div
            ref={qrRef}
            className="relative mx-auto w-fit p-3 sm:p-4 bg-white rounded-3xl border-2 border-deeprose/20 shadow-[0_12px_32px_-8px_rgba(92,42,59,0.15)] group"
          >
            <QRCodeSVG
              value={shareUrl}
              size={170}
              level="H"
              bgColor="#ffffff"
              fgColor="#5c2a3b"
              imageSettings={{
                src: HEART_ICON_DATA_URL,
                x: undefined,
                y: undefined,
                height: 32,
                width: 32,
                excavate: true,
              }}
            />
          </div>

          {/* If user is not logged in, show hint to save permanently */}
          {!user && (
            <div className="mt-3 p-2.5 rounded-xl bg-blush/40 border border-deeprose/20 flex items-center justify-between gap-2 text-left">
              <span className="text-[11px] font-mono text-plum/70 flex items-center gap-1.5">
                <Lock size={12} className="text-deeprose flex-shrink-0" />
                <span>Save your custom story &amp; photos to cloud?</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenLogin?.();
                }}
                className="text-[10px] font-mono font-semibold text-deeprose hover:underline whitespace-nowrap"
              >
                Login / Sign Up
              </button>
            </div>
          )}

          {/* Device / Host selector pill */}
          <div className="mt-3 p-2 bg-blush/30 rounded-2xl border border-rose/20 text-left">
            <div className="flex items-center justify-between px-1.5 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-deeprose font-semibold flex items-center gap-1">
                <Wifi size={11} />
                <span>Network Target</span>
              </span>
              <span className="text-[10px] font-mono text-plum/50 truncate max-w-[150px]">
                {hostChoice === "network" ? "Wi-Fi (Phone Scan)" : "Localhost"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
              <button
                type="button"
                onClick={() => setHostChoice("network")}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl transition-all ${
                  hostChoice === "network"
                    ? "bg-white text-deeprose shadow-sm font-semibold"
                    : "text-plum/70 hover:text-plum"
                }`}
              >
                <Smartphone size={12} />
                <span>Wi-Fi IP (Phone)</span>
              </button>
              <button
                type="button"
                onClick={() => setHostChoice("current")}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl transition-all ${
                  hostChoice === "current"
                    ? "bg-white text-deeprose shadow-sm font-semibold"
                    : "text-plum/70 hover:text-plum"
                }`}
              >
                <ExternalLink size={12} />
                <span>Localhost</span>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-3.5 grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center justify-center gap-1.5 rounded-full border border-deeprose/30 bg-white py-2 px-3 text-xs font-mono tracking-wider text-deeprose hover:bg-blush transition-colors"
            >
              {copied ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
              <span>{copied ? "Copied!" : "Copy Link"}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadCard}
              className="flex items-center justify-center gap-1.5 rounded-full bg-deeprose py-2 px-3 text-xs font-mono tracking-wider text-cream hover:bg-[#b82357] shadow-sm transition-all"
            >
              <Download size={13} />
              <span>Save Card</span>
            </button>
          </div>

          {/* Direct test link */}
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-mono text-plum/60 hover:text-deeprose transition-colors"
          >
            <span>Preview Receiver Experience</span>
            <ExternalLink size={11} />
          </a>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
