export const PHOTO_STORAGE_KEY = "forever-photos";

export const DEFAULT_PHOTOS = [
  {
    id: "p-1",
    url: "https://images.unsplash.com/photo-1543829969-57899edf981b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjBob2xkaW5nJTIwaGFuZHMlMjBzdW5zZXQlMjByb21hbnNlfGVufDB8fHx8MTc4OTI1NjI4Mnww&ixlib=rb-4.1.0&q=85",
    caption: "The moment time stood still with you.",
    date: "Golden Hour Glow",
    rotation: "-2deg",
  },
  {
    id: "p-2",
    url: "https://images.unsplash.com/photo-1614991539310-630818071643?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDR8MHwxfHNlYXJjaHwzfHxyb21hbnRpYyUyMHZpbnRhZ2UlMjBsZXR0ZXIlMjByb3Nlc3xlbnwwfHx8fDE3ODkyNTYyNzF8MA&ixlib=rb-4.1.0&q=85",
    caption: "Letters written in heartbeats, not words.",
    date: "Every Morning",
    rotation: "3deg",
  },
  {
    id: "p-3",
    url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
    caption: "The warmth of our quiet, slow Tuesday evenings.",
    date: "Candlelight Hours",
    rotation: "-1.5deg",
  },
  {
    id: "p-4",
    url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
    caption: "Every road feels like home as long as you're beside me.",
    date: "Endless Horizons",
    rotation: "2.5deg",
  },
  {
    id: "p-5",
    url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
    caption: "The simple magic of your laughter.",
    date: "Pure Serendipity",
    rotation: "-3deg",
  },
  {
    id: "p-6",
    url: "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
    caption: "A million sunsets would never be enough.",
    date: "Forever & Always",
    rotation: "1.5deg",
  },
];

/**
 * Compress an image file using an off-screen canvas to minimize storage footprint
 * and keep local storage well within browser quotas (~30-60KB per image).
 */
export function compressImageFile(file, maxWidth = 800, maxHeight = 800, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

export function loadStoredPhotos() {
  try {
    const raw = localStorage.getItem(PHOTO_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    /* fallback to default */
  }
  return DEFAULT_PHOTOS;
}

export function saveStoredPhotos(photos) {
  try {
    localStorage.setItem(PHOTO_STORAGE_KEY, JSON.stringify(photos));
  } catch (e) {
    console.warn("Could not save photos to localStorage:", e);
  }
}

/**
 * Parses query params from current URL to check if the page was opened via a customized QR link.
 */
export function getUrlParams() {
  try {
    const search = new URLSearchParams(window.location.search);
    const to = search.get("to") || search.get("recipient");
    const from = search.get("from") || search.get("sender");
    const msg = search.get("msg");
    const customPhoto = search.get("photo");
    if (to || from) {
      return {
        recipient: to ? decodeURIComponent(to) : null,
        sender: from ? decodeURIComponent(from) : null,
        message: msg ? decodeURIComponent(msg) : null,
        customPhoto: customPhoto ? decodeURIComponent(customPhoto) : null,
        isShared: true,
      };
    }
  } catch (e) {
    /* ignore parsing issues */
  }
  return null;
}

/**
 * Builds the customized URL to be embedded in the QR Code.
 */
export function buildShareUrl({ sender, recipient, baseUrl, customPhotoUrl }) {
  try {
    const url = new URL(baseUrl || window.location.origin);
    url.pathname = window.location.pathname;
    if (recipient) url.searchParams.set("to", recipient);
    if (sender) url.searchParams.set("from", sender);
    if (customPhotoUrl && customPhotoUrl.startsWith("http")) {
      url.searchParams.set("photo", customPhotoUrl);
    }
    return url.toString();
  } catch (e) {
    const safeBase = baseUrl || "http://localhost:3000";
    return `${safeBase}/?to=${encodeURIComponent(recipient)}&from=${encodeURIComponent(sender)}`;
  }
}
