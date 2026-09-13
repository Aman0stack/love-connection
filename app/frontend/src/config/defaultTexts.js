export const DEFAULT_CUSTOM_TEXTS = {
  heroTitle1: "In all the world,",
  heroTitle2: "there is no heart",
  heroTitle3: "for me like yours.",
  heroSealText: "AN ODE TO LIFELONG DEVOTION • EST. FOREVER •",
  heroCardTag: "postmarked with love",
  heroCardEst: "est. forever",
  manifestoEyebrow: "The Manifesto",
  manifestoTitle: "Four pillars of my love, numbered like chapters of a book without an ending.",
  chapter1Title: "The Sanctuary of Your Laugh",
  chapter1Quote: "In a noisy world, your voice is my grounding silence. Every heavy day unspools the moment you smile.",
  chapter2Title: "The Everyday Magic",
  chapter2Quote: "Not just the anniversaries, but the Tuesday morning coffees, the warm socks on chilly floors, and the quiet glances across crowded rooms.",
  chapter3Title: "Unshakable Loyalty",
  chapter3Quote: "To be the anchor when storms roll in, and the warm fire when night falls. Through every unknown horizon, I stand beside you.",
  chapter4Title: "The Infinite Horizon",
  chapter4Quote: "Loving you is not a chapter that concludes; it is the entire book, written in ink that outlives the stars.",
  metric1Value: "∞",
  metric1Label: "laughs shared & counting",
  metric2Value: "10,000+",
  metric2Label: "sunrises still to come",
  metric3Value: "1",
  metric3Label: "question that changes everything",
  galleryEyebrow: "Cherished Scrapbook",
  galleryTitle: "Moments in Frames",
  gallerySubtitle: "A visual anthology of us — every laugh, every quiet evening, and every promise captured for eternity.",
  proposalGreeting: "Dearest",
  proposalTitle: "Will you love me forever?",
  proposalNote: "Every heartbeat, every dawn, every ordinary Tuesday — I want them all with you.",
  proposalYesText: "Yes, forever",
  celebrationTitle: "Forever, then.",
  celebrationMessage: "You said yes — and just like that, every tomorrow became a promise. I will love you through quiet dawns and golden sunsets, in this lifetime and every one after.",
  qrSpecialMessage: "My love, every heartbeat of mine belongs to you. Open this letter to begin our forever story.",
  footerTagline: "Handcrafted with boundless love • vow locked",
};

export const TEXT_STORAGE_KEY = "forever-custom-texts";

export function loadStoredTexts() {
  try {
    const raw = localStorage.getItem(TEXT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return { ...DEFAULT_CUSTOM_TEXTS, ...parsed };
      }
    }
  } catch (e) {
    /* fallback to defaults */
  }
  return { ...DEFAULT_CUSTOM_TEXTS };
}

export function saveStoredTexts(texts) {
  try {
    localStorage.setItem(TEXT_STORAGE_KEY, JSON.stringify(texts));
  } catch (e) {
    /* ignore */
  }
}
