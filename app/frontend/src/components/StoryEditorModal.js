import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Heart, Save, RotateCcw, BookOpen, Quote, Trophy, QrCode } from "lucide-react";
import { DEFAULT_CUSTOM_TEXTS } from "../config/defaultTexts";

const TABS = [
  { id: "hero", label: "Hero & Ode", icon: Sparkles },
  { id: "manifesto", label: "4 Chapters", icon: BookOpen },
  { id: "metrics", label: "Love Stats", icon: Trophy },
  { id: "proposal", label: "Proposal & Vow", icon: Heart },
  { id: "celebration", label: "Celebration Letter", icon: Quote },
  { id: "qr", label: "QR Love Note", icon: QrCode },
];

export default function StoryEditorModal({ open, onClose, texts, onSaveAll }) {
  const [activeTab, setActiveTab] = useState("hero");
  const [formData, setFormData] = useState({ ...DEFAULT_CUSTOM_TEXTS, ...texts });
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData({ ...DEFAULT_CUSTOM_TEXTS, ...texts });
      setSavedSuccess(false);
    }
  }, [open, texts]);

  const handleChange = (key, val) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
    setSavedSuccess(false);
  };

  const handleSave = () => {
    onSaveAll(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  const handleResetDefaults = () => {
    if (window.confirm("Reset all story texts to default romantic phrases?")) {
      setFormData({ ...DEFAULT_CUSTOM_TEXTS });
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div
        data-testid="story-editor-overlay"
        onClick={onClose}
        className="fixed inset-0 z-50 bg-plum/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-2xl w-full max-h-[90vh] bg-[#fffcf9] rounded-[2rem] border border-deeprose/20 shadow-[0_25px_60px_-15px_rgba(92,42,59,0.35)] flex flex-col my-auto overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 pb-4 border-b border-rose/15 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-deeprose mb-1">
                <Sparkles size={14} className="text-gold" />
                <span>Love Story Studio</span>
              </div>
              <h3 className="font-serif font-bold text-2xl sm:text-3xl text-plum">
                Customize Every Word
              </h3>
              <p className="text-xs sm:text-sm text-plum/70 mt-0.5">
                Every line you write is saved permanently to MongoDB for your proposal page.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-blush/60 text-plum hover:text-deeprose flex items-center justify-center transition-colors flex-shrink-0"
            >
              <X size={16} />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="px-5 sm:px-6 pt-3 pb-2 flex gap-1.5 overflow-x-auto no-scrollbar border-b border-rose/10 bg-blush/20">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-mono whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-deeprose text-cream shadow-sm font-semibold"
                      : "text-plum/70 hover:text-deeprose hover:bg-white/60"
                  }`}
                >
                  <Icon size={12} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Contents - Scrollable */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-4 max-h-[55vh]">
            {activeTab === "hero" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-widest text-plum/70 mb-1">
                    Hero Title — Line 1
                  </label>
                  <input
                    type="text"
                    value={formData.heroTitle1 || ""}
                    onChange={(e) => handleChange("heroTitle1", e.target.value)}
                    className="w-full rounded-xl border border-rose/25 bg-white px-4 py-2.5 font-serif text-lg text-plum outline-none focus:border-deeprose"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-widest text-plum/70 mb-1">
                    Hero Title — Line 2
                  </label>
                  <input
                    type="text"
                    value={formData.heroTitle2 || ""}
                    onChange={(e) => handleChange("heroTitle2", e.target.value)}
                    className="w-full rounded-xl border border-rose/25 bg-white px-4 py-2.5 font-serif text-lg text-plum outline-none focus:border-deeprose"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-widest text-plum/70 mb-1">
                    Hero Title — Line 3 (Closing line)
                  </label>
                  <input
                    type="text"
                    value={formData.heroTitle3 || ""}
                    onChange={(e) => handleChange("heroTitle3", e.target.value)}
                    className="w-full rounded-xl border border-rose/25 bg-white px-4 py-2.5 font-serif text-lg text-plum outline-none focus:border-deeprose"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-widest text-plum/70 mb-1">
                      Rotating Wax Seal Motto
                    </label>
                    <input
                      type="text"
                      value={formData.heroSealText || ""}
                      onChange={(e) => handleChange("heroSealText", e.target.value)}
                      className="w-full rounded-xl border border-rose/25 bg-white px-3.5 py-2 text-xs font-mono text-plum outline-none focus:border-deeprose"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-widest text-plum/70 mb-1">
                      Letter Stamp Tag
                    </label>
                    <input
                      type="text"
                      value={formData.heroCardTag || ""}
                      onChange={(e) => handleChange("heroCardTag", e.target.value)}
                      className="w-full rounded-xl border border-rose/25 bg-white px-3.5 py-2 text-xs font-mono text-plum outline-none focus:border-deeprose"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "manifesto" && (
              <div className="space-y-5">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-widest text-plum/70 mb-1">
                    Manifesto Subtitle Headline
                  </label>
                  <textarea
                    rows={2}
                    value={formData.manifestoTitle || ""}
                    onChange={(e) => handleChange("manifestoTitle", e.target.value)}
                    className="w-full rounded-xl border border-rose/25 bg-white p-3 font-serif text-sm text-plum outline-none focus:border-deeprose resize-none"
                  />
                </div>

                {/* Chapter 1 */}
                <div className="p-4 rounded-2xl bg-blush/30 border border-rose/20 space-y-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gold font-bold block">
                    Chapter 01
                  </span>
                  <input
                    type="text"
                    placeholder="Chapter Title"
                    value={formData.chapter1Title || ""}
                    onChange={(e) => handleChange("chapter1Title", e.target.value)}
                    className="w-full rounded-lg border border-rose/25 bg-white px-3 py-1.5 font-serif italic text-base text-plum outline-none focus:border-deeprose"
                  />
                  <textarea
                    rows={2}
                    placeholder="Chapter Romantic Vow / Quote"
                    value={formData.chapter1Quote || ""}
                    onChange={(e) => handleChange("chapter1Quote", e.target.value)}
                    className="w-full rounded-lg border border-rose/25 bg-white p-2.5 text-xs font-serif text-plum outline-none focus:border-deeprose resize-none"
                  />
                </div>

                {/* Chapter 2 */}
                <div className="p-4 rounded-2xl bg-blush/30 border border-rose/20 space-y-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gold font-bold block">
                    Chapter 02
                  </span>
                  <input
                    type="text"
                    placeholder="Chapter Title"
                    value={formData.chapter2Title || ""}
                    onChange={(e) => handleChange("chapter2Title", e.target.value)}
                    className="w-full rounded-lg border border-rose/25 bg-white px-3 py-1.5 font-serif italic text-base text-plum outline-none focus:border-deeprose"
                  />
                  <textarea
                    rows={2}
                    placeholder="Chapter Romantic Vow / Quote"
                    value={formData.chapter2Quote || ""}
                    onChange={(e) => handleChange("chapter2Quote", e.target.value)}
                    className="w-full rounded-lg border border-rose/25 bg-white p-2.5 text-xs font-serif text-plum outline-none focus:border-deeprose resize-none"
                  />
                </div>

                {/* Chapter 3 */}
                <div className="p-4 rounded-2xl bg-blush/30 border border-rose/20 space-y-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gold font-bold block">
                    Chapter 03
                  </span>
                  <input
                    type="text"
                    placeholder="Chapter Title"
                    value={formData.chapter3Title || ""}
                    onChange={(e) => handleChange("chapter3Title", e.target.value)}
                    className="w-full rounded-lg border border-rose/25 bg-white px-3 py-1.5 font-serif italic text-base text-plum outline-none focus:border-deeprose"
                  />
                  <textarea
                    rows={2}
                    placeholder="Chapter Romantic Vow / Quote"
                    value={formData.chapter3Quote || ""}
                    onChange={(e) => handleChange("chapter3Quote", e.target.value)}
                    className="w-full rounded-lg border border-rose/25 bg-white p-2.5 text-xs font-serif text-plum outline-none focus:border-deeprose resize-none"
                  />
                </div>

                {/* Chapter 4 */}
                <div className="p-4 rounded-2xl bg-blush/30 border border-rose/20 space-y-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gold font-bold block">
                    Chapter 04
                  </span>
                  <input
                    type="text"
                    placeholder="Chapter Title"
                    value={formData.chapter4Title || ""}
                    onChange={(e) => handleChange("chapter4Title", e.target.value)}
                    className="w-full rounded-lg border border-rose/25 bg-white px-3 py-1.5 font-serif italic text-base text-plum outline-none focus:border-deeprose"
                  />
                  <textarea
                    rows={2}
                    placeholder="Chapter Romantic Vow / Quote"
                    value={formData.chapter4Quote || ""}
                    onChange={(e) => handleChange("chapter4Quote", e.target.value)}
                    className="w-full rounded-lg border border-rose/25 bg-white p-2.5 text-xs font-serif text-plum outline-none focus:border-deeprose resize-none"
                  />
                </div>
              </div>
            )}

            {activeTab === "metrics" && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-white border border-rose/20 grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <label className="block text-[10px] font-mono text-plum/60 mb-1">Metric 1</label>
                    <input
                      type="text"
                      value={formData.metric1Value || ""}
                      onChange={(e) => handleChange("metric1Value", e.target.value)}
                      className="w-full rounded-lg border border-rose/25 bg-cream/40 p-2 font-serif text-xl text-deeprose outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-mono text-plum/60 mb-1">Label</label>
                    <input
                      type="text"
                      value={formData.metric1Label || ""}
                      onChange={(e) => handleChange("metric1Label", e.target.value)}
                      className="w-full rounded-lg border border-rose/25 bg-cream/40 p-2 text-xs font-mono text-plum outline-none"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-rose/20 grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <label className="block text-[10px] font-mono text-plum/60 mb-1">Metric 2</label>
                    <input
                      type="text"
                      value={formData.metric2Value || ""}
                      onChange={(e) => handleChange("metric2Value", e.target.value)}
                      className="w-full rounded-lg border border-rose/25 bg-cream/40 p-2 font-serif text-xl text-deeprose outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-mono text-plum/60 mb-1">Label</label>
                    <input
                      type="text"
                      value={formData.metric2Label || ""}
                      onChange={(e) => handleChange("metric2Label", e.target.value)}
                      className="w-full rounded-lg border border-rose/25 bg-cream/40 p-2 text-xs font-mono text-plum outline-none"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-rose/20 grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <label className="block text-[10px] font-mono text-plum/60 mb-1">Metric 3</label>
                    <input
                      type="text"
                      value={formData.metric3Value || ""}
                      onChange={(e) => handleChange("metric3Value", e.target.value)}
                      className="w-full rounded-lg border border-rose/25 bg-cream/40 p-2 font-serif text-xl text-deeprose outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-mono text-plum/60 mb-1">Label</label>
                    <input
                      type="text"
                      value={formData.metric3Label || ""}
                      onChange={(e) => handleChange("metric3Label", e.target.value)}
                      className="w-full rounded-lg border border-rose/25 bg-cream/40 p-2 text-xs font-mono text-plum outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "proposal" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-widest text-plum/70 mb-1">
                    Proposal Big Question Title
                  </label>
                  <input
                    type="text"
                    value={formData.proposalTitle || ""}
                    onChange={(e) => handleChange("proposalTitle", e.target.value)}
                    className="w-full rounded-xl border border-rose/25 bg-white px-4 py-2.5 font-serif text-xl text-plum outline-none focus:border-deeprose"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-widest text-plum/70 mb-1">
                    Romantic Proposal Vow Note
                  </label>
                  <textarea
                    rows={3}
                    value={formData.proposalNote || ""}
                    onChange={(e) => handleChange("proposalNote", e.target.value)}
                    className="w-full rounded-xl border border-rose/25 bg-white p-3 font-serif italic text-base text-plum outline-none focus:border-deeprose resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-widest text-plum/70 mb-1">
                    "Yes" Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.proposalYesText || "Yes, forever"}
                    onChange={(e) => handleChange("proposalYesText", e.target.value)}
                    className="w-full rounded-xl border border-rose/25 bg-white px-4 py-2 text-sm font-serif text-plum outline-none focus:border-deeprose"
                  />
                </div>
              </div>
            )}

            {activeTab === "celebration" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-widest text-plum/70 mb-1">
                    Celebration Headline (When She Says Yes)
                  </label>
                  <input
                    type="text"
                    value={formData.celebrationTitle || ""}
                    onChange={(e) => handleChange("celebrationTitle", e.target.value)}
                    className="w-full rounded-xl border border-rose/25 bg-white px-4 py-2.5 font-serif text-xl text-plum outline-none focus:border-deeprose"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-widest text-plum/70 mb-1">
                    Celebration Keepsake Letter Message
                  </label>
                  <textarea
                    rows={4}
                    value={formData.celebrationMessage || ""}
                    onChange={(e) => handleChange("celebrationMessage", e.target.value)}
                    className="w-full rounded-xl border border-rose/25 bg-white p-3 font-serif italic text-base text-plum outline-none focus:border-deeprose resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-widest text-plum/70 mb-1">
                    Footer Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.footerTagline || ""}
                    onChange={(e) => handleChange("footerTagline", e.target.value)}
                    className="w-full rounded-xl border border-rose/25 bg-white px-4 py-2 text-xs font-mono text-plum outline-none focus:border-deeprose"
                  />
                </div>
              </div>
            )}

            {activeTab === "qr" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-widest text-plum/70 mb-1">
                    Special Love Message Integrated In QR
                  </label>
                  <p className="text-xs text-plum/60 mb-2">
                    This romantic message appears above the QR code and is revealed as a private love letter popup when your partner scans the QR code.
                  </p>
                  <textarea
                    rows={4}
                    value={formData.qrSpecialMessage || ""}
                    onChange={(e) => handleChange("qrSpecialMessage", e.target.value)}
                    className="w-full rounded-xl border border-rose/25 bg-white p-3 font-serif italic text-base text-plum outline-none focus:border-deeprose resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-5 border-t border-rose/15 bg-white/70 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 text-xs font-mono text-plum/60 hover:text-red-600 transition-colors p-2"
            >
              <RotateCcw size={12} />
              <span className="hidden sm:inline">Reset Defaults</span>
            </button>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-plum/20 px-4 py-2 text-xs font-mono text-plum/70 hover:bg-blush transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-2 rounded-full bg-deeprose px-6 py-2.5 text-xs font-mono uppercase tracking-widest text-cream hover:bg-[#b82357] shadow-md transition-all"
              >
                <Save size={13} />
                <span>{savedSuccess ? "Saved ♥" : "Save All Changes"}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
