import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Plus, Trash2, X, ZoomIn, Sparkles } from "lucide-react";
import EditableText from "./EditableText";

export default function MemoryGallery({
  photos,
  onOpenUpload,
  onDeletePhoto,
  names,
  user,
  isOwner,
  texts,
  onSaveText,
}) {
  const [activePhoto, setActivePhoto] = useState(null);

  const galleryEyebrow = texts?.galleryEyebrow || "Cherished Scrapbook";
  const galleryTitle = texts?.galleryTitle || "Moments in Frames";
  const gallerySubtitle =
    texts?.gallerySubtitle ||
    "A visual anthology of us — every laugh, every quiet evening, and every promise captured for eternity.";

  return (
    <section
      id="gallery"
      data-testid="gallery-section"
      className="relative mx-auto max-w-7xl px-4 sm:px-8 py-16 sm:py-32 overflow-hidden"
    >
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[700px] h-[300px] sm:h-[500px] bg-rose/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] font-mono text-deeprose/80 mb-2 sm:mb-3">
            <Sparkles size={14} className="text-gold animate-pulse" />
            <span>
              <EditableText
                value={galleryEyebrow}
                textKey="galleryEyebrow"
                isOwner={isOwner}
                onSave={onSaveText}
                label="Gallery tag"
              />
            </span>
          </div>
          <h2 className="font-serif font-semibold tracking-tight text-3xl sm:text-4xl lg:text-5xl text-plum">
            <EditableText
              value={galleryTitle}
              textKey="galleryTitle"
              isOwner={isOwner}
              onSave={onSaveText}
              label="Gallery Title"
            />
          </h2>
          <p className="mt-2.5 sm:mt-3 text-sm sm:text-lg text-plum/80 max-w-xl">
            <EditableText
              value={gallerySubtitle}
              textKey="gallerySubtitle"
              isOwner={isOwner}
              onSave={onSaveText}
              multiline
              label="Gallery Subtitle"
            />
          </p>
        </div>

        {isOwner && (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenUpload}
            data-testid="gallery-upload-btn"
            className="self-start md:self-auto flex items-center gap-2 rounded-full bg-deeprose px-5 sm:px-6 py-2.5 sm:py-3 text-xs font-mono uppercase tracking-widest text-cream shadow-[0_10px_25px_-5px_rgba(214,51,108,0.4)] hover:bg-[#b82357] transition-all duration-300"
          >
            <Plus size={16} />
            <span>Add Our Photo</span>
          </motion.button>
        )}
      </div>

      {/* Polaroid Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-10">
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id || index}
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: (index % 3) * 0.12 }}
            className="group relative max-w-sm mx-auto w-full"
          >
            {/* Polaroid Paper Frame */}
            <div
              style={{
                transform: `rotate(${photo.rotation || (index % 2 === 0 ? "-1.5deg" : "1.5deg")})`,
              }}
              className="relative bg-white/90 backdrop-blur p-4 pb-6 rounded-2xl border border-deeprose/15 shadow-[0_16px_36px_-12px_rgba(92,42,59,0.18)] transition-all duration-500 group-hover:rotate-0 group-hover:scale-[1.02] group-hover:shadow-[0_24px_50px_-15px_rgba(214,51,108,0.28)] group-hover:z-20"
            >
              {/* Washi tape visual */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 sm:w-20 h-4 sm:h-5 bg-blush2/80 backdrop-blur-md rounded-sm border-x border-dashed border-deeprose/30 shadow-sm rotate-1 pointer-events-none" />

              {/* Photo Canvas */}
              <div
                onClick={() => setActivePhoto(photo)}
                className="relative overflow-hidden rounded-xl aspect-[4/3] bg-blush/30 cursor-pointer group/img"
              >
                <img
                  src={photo.url}
                  alt={photo.caption || "Romantic memory"}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                
                {/* Overlay Zoom */}
                <div className="absolute inset-0 bg-plum/20 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="w-10 h-10 rounded-full bg-white/85 backdrop-blur text-deeprose flex items-center justify-center shadow-lg">
                    <ZoomIn size={18} />
                  </span>
                </div>

                {/* Direct delete button badge on top-right of image */}
                {isOwner && onDeletePhoto && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const photoId = photo.id || photo._id;
                      if (window.confirm("Delete this memory photo?")) {
                        onDeletePhoto(photoId);
                      }
                    }}
                    title="Delete photo"
                    className="absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full bg-white/95 text-red-600 hover:bg-red-600 hover:text-white shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              {/* Caption & Metadata */}
              <div className="mt-3.5 px-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-gold">
                    {photo.date || "Timeless Memory"}
                  </span>
                  {isOwner && onDeletePhoto && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const photoId = photo.id || photo._id;
                        if (window.confirm("Delete this memory from your scrapbook?")) {
                          onDeletePhoto(photoId);
                        }
                      }}
                      title="Delete photo"
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-red-600/80 hover:text-red-600 hover:underline px-2 py-0.5 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={12} />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
                <p className="font-serif italic text-base sm:text-lg text-plum/90 mt-1 leading-snug">
                  {photo.caption}
                </p>
              </div>

              {/* Heart icon watermark */}
              <div className="absolute bottom-3 right-4 text-deeprose/20 pointer-events-none">
                <Heart size={13} fill="currentColor" strokeWidth={0} />
              </div>
            </div>
          </motion.div>
        ))}

        {/* Upload Memory Call-to-action Card (Only visible to site owner) */}
        {isOwner && (
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            onClick={onOpenUpload}
            className="group relative cursor-pointer min-h-[300px] rounded-2xl border-2 border-dashed border-deeprose/30 bg-white/40 hover:bg-white/75 hover:border-deeprose transition-all duration-300 flex flex-col items-center justify-center p-6 text-center max-w-sm mx-auto w-full"
          >
            <div className="w-14 h-14 rounded-full bg-blush flex items-center justify-center text-deeprose shadow-inner group-hover:scale-110 transition-transform duration-300 mb-3">
              <Plus size={24} />
            </div>
            <h3 className="font-serif font-semibold text-lg sm:text-xl text-plum mb-1.5">
              Add Your Memory
            </h3>
            <p className="text-xs font-mono uppercase tracking-widest text-deeprose/80 max-w-[220px] leading-relaxed">
              Upload your personal couple photo or cherished snapshot
            </p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-mono text-plum/60 group-hover:text-deeprose transition-colors">
              <Heart size={12} fill="currentColor" strokeWidth={0} />
              Stored permanently in cloud
            </span>
          </motion.div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePhoto(null)}
            className="fixed inset-0 z-50 bg-plum/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-8 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full bg-white rounded-3xl p-4 sm:p-6 shadow-2xl border border-rose/30 my-auto"
            >
              <button
                type="button"
                onClick={() => setActivePhoto(null)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/80 backdrop-blur text-plum hover:text-deeprose flex items-center justify-center shadow-md transition-colors"
              >
                <X size={16} />
              </button>

              <div className="overflow-hidden rounded-2xl max-h-[65vh] flex items-center justify-center bg-cream">
                <img
                  src={activePhoto.url}
                  alt={activePhoto.caption}
                  className="w-full h-full object-contain max-h-[65vh] rounded-2xl"
                />
              </div>

              <div className="mt-4 text-center">
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-mono text-gold block mb-1">
                  {activePhoto.date || "Forever Moment"}
                </span>
                <p className="font-serif italic text-lg sm:text-2xl text-plum">
                  "{activePhoto.caption}"
                </p>
                <p className="text-xs font-mono text-deeprose/70 mt-1.5">
                  Dedicated to {names?.recipient || "You"} with love
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
