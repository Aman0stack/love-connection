import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Link as LinkIcon, X, Heart, Image as ImageIcon, Sparkles, Lock, Cloud, Trash2 } from "lucide-react";
import { uploadPhotoApi } from "../services/api";

export default function PhotoUploadModal({
  open,
  onClose,
  onAddPhoto,
  photos = [],
  onDeletePhoto,
  user,
  onOpenLogin,
}) {
  const [mode, setMode] = useState("file"); // 'file' | 'url' | 'manage'
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [date, setDate] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const resetState = () => {
    setSelectedFile(null);
    setPreview(null);
    setCaption("");
    setDate("");
    setUrlInput("");
    setUploading(false);
    setUploadProgress("");
    setError(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setError(null);
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    setPreview(urlInput.trim());
    setSelectedFile(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!preview) return;

    if (!user) {
      setError("Please log in first to upload photos to Cloudinary & MongoDB.");
      return;
    }

    setUploading(true);
    setUploadProgress("Uploading to Cloudinary CDN...");
    setError(null);

    try {
      setUploadProgress("Storing link in MongoDB Atlas...");
      const savedPhoto = await uploadPhotoApi({
        file: selectedFile,
        imageUrl: !selectedFile ? preview : undefined,
        caption: caption.trim() || "A moment I treasure forever.",
        date: date.trim() || "Sweet Memory",
      });

      onAddPhoto(savedPhoto);
      resetState();
      onClose();
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload to Cloudinary and MongoDB.");
    } finally {
      setUploading(false);
      setUploadProgress("");
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div
        data-testid="photo-upload-overlay"
        onClick={() => {
          resetState();
          onClose();
        }}
        className="fixed inset-0 z-50 bg-plum/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-lg w-full bg-[#fffcf9] rounded-3xl p-5 sm:p-8 border border-deeprose/20 shadow-[0_25px_60px_-15px_rgba(92,42,59,0.3)] my-auto max-h-[92vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => {
              resetState();
              onClose();
            }}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 text-plum/50 hover:text-deeprose transition-colors p-1"
          >
            <X size={20} />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-deeprose mb-1.5">
            <Cloud size={14} />
            <span>Cloudinary &amp; MongoDB Scrapbook</span>
          </div>
          <h3 className="font-serif font-semibold text-2xl sm:text-3xl text-plum">
            {mode === "manage" ? "Manage & Delete Photos" : "Add Your Love Photo"}
          </h3>
          <p className="text-xs sm:text-sm text-plum/70 mt-1 mb-4">
            {mode === "manage"
              ? "Review all pictures currently in your scrapbook. Delete old images with a single click."
              : "Upload directly to Cloudinary and store permanent links in MongoDB Atlas."}
          </p>

          {/* Login notice if unauthenticated */}
          {!user && mode !== "manage" && (
            <div className="mb-4 p-3 rounded-2xl bg-blush/60 border border-deeprose/25 flex items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2 text-deeprose">
                <Lock size={14} />
                <span>Login required to upload</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenLogin?.();
                }}
                className="bg-deeprose text-cream px-3 py-1.5 rounded-full hover:bg-[#b82357] transition-colors shadow-sm"
              >
                Log In
              </button>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-mono">
              {error}
            </div>
          )}

          {/* Mode Switcher */}
          <div className="flex gap-1.5 p-1 bg-blush/40 rounded-full mb-5 border border-rose/15">
            <button
              type="button"
              onClick={() => setMode("file")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
                mode === "file"
                  ? "bg-deeprose text-cream shadow-sm font-semibold"
                  : "text-plum/70 hover:text-deeprose"
              }`}
            >
              <Upload size={12} />
              <span>Upload</span>
            </button>
            <button
              type="button"
              onClick={() => setMode("url")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
                mode === "url"
                  ? "bg-deeprose text-cream shadow-sm font-semibold"
                  : "text-plum/70 hover:text-deeprose"
              }`}
            >
              <LinkIcon size={12} />
              <span>Link</span>
            </button>
            <button
              type="button"
              onClick={() => setMode("manage")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
                mode === "manage"
                  ? "bg-deeprose text-cream shadow-sm font-semibold"
                  : "text-plum/70 hover:text-deeprose"
              }`}
            >
              <Trash2 size={12} />
              <span>Manage ({photos.length})</span>
            </button>
          </div>

          {/* Content based on mode */}
          {mode === "manage" ? (
            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
              {photos.length === 0 ? (
                <div className="py-12 text-center text-plum/60 font-mono text-xs">
                  No photos uploaded yet. Switch to the Upload tab to add some!
                </div>
              ) : (
                photos.map((photo, idx) => {
                  const photoId = photo.id || photo._id;
                  return (
                    <div
                      key={photoId || idx}
                      className="flex items-center gap-3 p-2.5 rounded-2xl bg-white border border-deeprose/15 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <img
                        src={photo.url}
                        alt={photo.caption || "Scrapbook image"}
                        className="w-14 h-14 object-cover rounded-xl border border-rose/20 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-serif italic text-plum truncate">
                          {photo.caption || "Untitled memory"}
                        </p>
                        <p className="text-[10px] font-mono text-gold uppercase tracking-wider mt-0.5">
                          {photo.date || "Timeless"}
                        </p>
                      </div>
                      {onDeletePhoto && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm("Delete this photo from your scrapbook?")) {
                              onDeletePhoto(photoId);
                            }
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 transition-colors text-xs font-mono font-medium flex-shrink-0"
                        >
                          <Trash2 size={12} />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Upload Area / URL input */}
              {mode === "file" ? (
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {!preview ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-deeprose/30 hover:border-deeprose bg-white/70 hover:bg-blush/20 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group"
                    >
                      <div className="w-12 h-12 rounded-full bg-blush flex items-center justify-center text-deeprose mb-3 group-hover:scale-110 transition-transform">
                        <ImageIcon size={22} />
                      </div>
                      <p className="text-sm font-medium text-plum">
                        Click or drag a photo to upload
                      </p>
                      <span className="text-[11px] font-mono text-plum/60 mt-1">
                        Direct cloud upload to Cloudinary (PNG, JPG, WEBP)
                      </span>
                    </div>
                  ) : (
                    <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-black/5 border border-deeprose/20">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreview(null);
                          setSelectedFile(null);
                        }}
                        title="Remove selected preview"
                        className="absolute top-3 right-3 bg-red-600 text-white rounded-full p-1.5 shadow-md hover:bg-red-700 transition-colors flex items-center gap-1 text-[11px] font-mono px-2"
                      >
                        <Trash2 size={13} />
                        <span>Remove</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://example.com/romantic-photo.jpg"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className="flex-1 rounded-xl border border-deeprose/25 bg-white px-3.5 py-2.5 text-xs font-mono text-plum placeholder:text-plum/40 focus:border-deeprose focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleApplyUrl}
                      className="rounded-xl bg-blush text-deeprose font-mono text-xs px-3.5 py-2.5 hover:bg-blush2 transition-colors whitespace-nowrap"
                    >
                      Preview
                    </button>
                  </div>
                  {preview && (
                    <div className="mt-3 relative rounded-2xl overflow-hidden aspect-[16/10] bg-black/5 border border-deeprose/20">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreview(null);
                          setSelectedFile(null);
                        }}
                        title="Remove selected preview"
                        className="absolute top-3 right-3 bg-red-600 text-white rounded-full p-1.5 shadow-md hover:bg-red-700 transition-colors flex items-center gap-1 text-[11px] font-mono px-2"
                      >
                        <Trash2 size={13} />
                        <span>Remove</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Caption Input */}
              <div>
                <label className="block text-[11px] uppercase tracking-widest font-mono text-plum/70 mb-1">
                  Handwritten Caption
                </label>
                <input
                  type="text"
                  placeholder="e.g. When you smiled and made my world stop..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  maxLength={90}
                  className="w-full rounded-xl border border-deeprose/25 bg-white px-3.5 py-2 font-serif italic text-sm sm:text-base text-plum placeholder:text-plum/40 focus:border-deeprose focus:outline-none"
                />
              </div>

              {/* Date or Place Stamp */}
              <div>
                <label className="block text-[11px] uppercase tracking-widest font-mono text-plum/70 mb-1">
                  Stamp (Date or Memory Tag)
                </label>
                <input
                  type="text"
                  placeholder="e.g. That Rainy Tuesday • Sunset Pier"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  maxLength={40}
                  className="w-full rounded-xl border border-deeprose/25 bg-white px-3.5 py-2 text-xs font-mono text-plum placeholder:text-plum/40 focus:border-deeprose focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!preview || uploading}
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-full bg-deeprose py-3 text-xs font-mono uppercase tracking-widest text-cream shadow-[0_8px_20px_-4px_rgba(214,51,108,0.4)] hover:bg-[#b82357] transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                {uploading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>{uploadProgress || "Uploading..."}</span>
                  </>
                ) : (
                  <>
                    <Cloud size={14} />
                    <span>Save to Cloudinary &amp; MongoDB</span>
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
