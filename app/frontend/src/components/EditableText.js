import { useState, useRef, useEffect } from "react";
import { PenLine, Check, X } from "lucide-react";

export default function EditableText({
  value,
  textKey,
  onSave,
  isOwner,
  tag = "span",
  className = "",
  multiline = false,
  label = "Edit text",
  children,
}) {
  const [editing, setEditing] = useState(false);
  const [currentVal, setCurrentVal] = useState(value || "");
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    setCurrentVal(value || "");
  }, [value]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current.select) {
        inputRef.current.select();
      }
    }
  }, [editing]);

  // Click outside to auto-save
  useEffect(() => {
    if (!editing) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        handleSave();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [editing, currentVal]);

  if (!isOwner) {
    const Tag = tag;
    return <Tag className={className}>{children || value}</Tag>;
  }

  const handleSave = () => {
    const trimmed = currentVal.trim();
    if (trimmed && trimmed !== value) {
      onSave?.(textKey, trimmed);
    }
    setEditing(false);
  };

  const handleCancel = () => {
    setCurrentVal(value || "");
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (!multiline || e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  if (editing) {
    return (
      <span
        ref={containerRef}
        className="inline-flex flex-col gap-1.5 p-2 bg-white/98 backdrop-blur-md rounded-2xl shadow-[0_12px_30px_rgba(214,51,108,0.2)] border-2 border-deeprose/50 z-30 relative my-1 text-left w-full max-w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="flex items-center justify-between gap-2 px-1">
          <span className="text-[10px] font-mono tracking-widest uppercase text-deeprose font-semibold flex items-center gap-1">
            <PenLine size={10} />
            <span>{label}</span>
          </span>
          <span className="text-[9px] font-mono text-plum/50">
            {multiline ? "Ctrl+Enter or click outside to save" : "Enter or click outside to save"}
          </span>
        </span>

        {multiline ? (
          <textarea
            ref={inputRef}
            value={currentVal}
            onChange={(e) => setCurrentVal(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
            className="w-full rounded-xl border border-rose/30 bg-cream/40 p-2.5 text-sm sm:text-base font-serif text-plum outline-none focus:border-deeprose resize-y min-h-[75px]"
          />
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={currentVal}
            onChange={(e) => setCurrentVal(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full rounded-xl border border-rose/30 bg-cream/40 px-3 py-2 text-sm sm:text-base font-serif text-plum outline-none focus:border-deeprose"
          />
        )}

        <span className="flex items-center justify-end gap-1.5 pt-0.5">
          <button
            type="button"
            onClick={handleSave}
            title="Save changes"
            className="p-1.5 rounded-lg bg-deeprose text-cream hover:bg-[#b82357] transition-colors shadow-sm flex items-center gap-1 text-[11px] font-mono px-3 py-1 font-medium"
          >
            <Check size={12} />
            <span>Save</span>
          </button>
          <button
            type="button"
            onClick={handleCancel}
            title="Cancel"
            className="p-1.5 rounded-lg bg-plum/10 text-plum/70 hover:bg-plum/20 transition-colors text-[11px] font-mono px-2.5 py-1"
          >
            <X size={12} />
            <span>Cancel</span>
          </button>
        </span>
      </span>
    );
  }

  const Tag = tag;

  return (
    <span
      className="group/edit relative inline-block cursor-pointer border-b border-dashed border-deeprose/30 hover:border-deeprose hover:bg-rose/5 rounded px-0.5 transition-all duration-200"
      onClick={() => setEditing(true)}
      title="Click to edit text directly"
    >
      <Tag className={`${className} transition-colors group-hover/edit:text-deeprose/90`}>
        {children || value}
      </Tag>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setEditing(true);
        }}
        title={`Click to edit: ${label}`}
        className="opacity-70 group-hover/edit:opacity-100 transition-opacity ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-deeprose/80 hover:bg-deeprose text-cream shadow-sm hover:scale-110 align-middle -translate-y-0.5"
      >
        <PenLine size={10} />
      </button>
    </span>
  );
}
