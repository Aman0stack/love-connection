import { useCallback, useEffect, useState } from "react";
import Lenis from "lenis";
import { DEFAULT_NAMES, NAMES_STORAGE_KEY } from "./config/names";
import {
  loadStoredPhotos,
  saveStoredPhotos,
  getUrlParams,
} from "./config/photoStorage";
import {
  DEFAULT_CUSTOM_TEXTS,
  loadStoredTexts,
  saveStoredTexts,
} from "./config/defaultTexts";
import {
  fetchPhotos,
  fetchUserSite,
  deletePhotoApi,
  getCurrentUser,
  updateProfile,
} from "./services/api";
import { playCelebration } from "./audio/musicBox";
import {
  playSong,
  pauseSong,
  toggleSong,
  addSongListener,
  enableAutoPlayOnInteraction,
} from "./audio/songPlayer";
import FloatingHeartsCanvas from "./components/FloatingHeartsCanvas";
import ConfettiBurst from "./components/ConfettiBurst";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Manifesto from "./components/Manifesto";
import MemoryGallery from "./components/MemoryGallery";
import Question from "./components/Question";
import CelebrationModal from "./components/CelebrationModal";
import NamesModal from "./components/NamesModal";
import PhotoUploadModal from "./components/PhotoUploadModal";
import LoginModal from "./components/LoginModal";
import QrModal from "./components/QrModal";
import StoryEditorModal from "./components/StoryEditorModal";
import SpecialMessageRevealModal from "./components/SpecialMessageRevealModal";
import Footer from "./components/Footer";
import { Heart, Sparkles, X, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function loadInitialNames() {
  const urlData = getUrlParams();
  if (urlData && urlData.sender && urlData.recipient) {
    return {
      sender: urlData.sender,
      recipient: urlData.recipient,
      proposalNote: urlData.message || DEFAULT_NAMES.proposalNote,
    };
  }
  try {
    const raw = localStorage.getItem(NAMES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.sender && parsed.recipient) {
        return {
          sender: parsed.sender,
          recipient: parsed.recipient,
          proposalNote: parsed.proposalNote || DEFAULT_NAMES.proposalNote,
        };
      }
    }
  } catch (e) {
    /* fall through to defaults */
  }
  return DEFAULT_NAMES;
}

export default function App() {
  const [names, setNames] = useState(loadInitialNames);
  const [texts, setTexts] = useState(loadStoredTexts);
  const [photos, setPhotos] = useState(loadStoredPhotos);
  const [user, setUser] = useState(null);
  const [namesOpen, setNamesOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [storyEditorOpen, setStoryEditorOpen] = useState(false);
  const [revealOpen, setRevealOpen] = useState(false);
  const [specialMessage, setSpecialMessage] = useState("");
  const [musicOn, setMusicOn] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [sharedNotice, setSharedNotice] = useState(null);

  // Background audio setup with infinite loop & interaction auto-play
  useEffect(() => {
    enableAutoPlayOnInteraction();
    const unsubscribeSong = addSongListener((playing) => {
      setMusicOn(playing);
    });

    // Try playing immediately
    playSong().catch(() => {});

    return () => {
      unsubscribeSong();
    };
  }, []);

  // Check URL parameters on mount
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const targetUser = searchParams.get("u")?.trim().toLowerCase();
    const queryMsg = searchParams.get("msg")?.trim();

    if (queryMsg) {
      setSpecialMessage(queryMsg);
      setRevealOpen(true);
    }

    if (targetUser) {
      // Receiver view: Fetch this specific user's proposal and photos
      fetchUserSite(targetUser)
        .then((siteData) => {
          if (siteData && siteData.user) {
            setNames({
              sender: siteData.user.senderName || "Romeo",
              recipient: siteData.user.recipientName || "Juliet",
              proposalNote: siteData.user.proposalNote || DEFAULT_NAMES.proposalNote,
            });
            if (siteData.user.customTexts) {
              setTexts((prev) => ({ ...prev, ...siteData.user.customTexts }));
              if (!queryMsg && siteData.user.customTexts.qrSpecialMessage) {
                setSpecialMessage(siteData.user.customTexts.qrSpecialMessage);
                setRevealOpen(true);
              }
            }
            setSharedNotice(
              `A private love letter prepared specially for ${siteData.user.recipientName} from ${siteData.user.senderName} ♥`
            );
          }
          if (siteData && siteData.photos && siteData.photos.length > 0) {
            setPhotos(siteData.photos);
          }
        })
        .catch((err) => {
          console.warn("Could not load user site:", err.message);
        });
    } else {
      // Creator / General view: check login session
      getCurrentUser()
        .then((currentUser) => {
          if (currentUser) {
            setUser(currentUser);
            if (currentUser.senderName && currentUser.recipientName) {
              setNames({
                sender: currentUser.senderName,
                recipient: currentUser.recipientName,
                proposalNote: currentUser.proposalNote || DEFAULT_NAMES.proposalNote,
              });
            }
            if (currentUser.customTexts) {
              setTexts((prev) => ({ ...prev, ...currentUser.customTexts }));
            }
            return fetchPhotos(currentUser.username);
          } else {
            return fetchPhotos();
          }
        })
        .then((fetchedPhotos) => {
          if (fetchedPhotos && fetchedPhotos.length > 0) {
            setPhotos(fetchedPhotos);
          }
        })
        .catch((err) => {
          console.warn("Backend photos fallback:", err.message);
        });
    }
  }, []);

  // Smooth scrolling with Lenis
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95 });
    window.__lenis = lenis;
    let raf = 0;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  const toggleMusic = useCallback(() => {
    toggleSong();
  }, []);

  const handleYes = useCallback(() => {
    setCelebrating(true);
    playCelebration();
  }, []);

  const handleReplay = useCallback(() => {
    setCelebrating(false);
    playCelebration();
    setTimeout(() => setCelebrating(true), 60);
  }, []);

  // Dynamic permission model:
  // Visitor is in Receiver mode ONLY if viewing another user's shared link (?u=...)
  // On localhost:3000 / Creator view, isOwner is true by default so all texts are editable and images manageable!
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const targetUser = searchParams?.get("u")?.trim().toLowerCase();
  const isReceiver = Boolean(
    targetUser && (!user || user.username?.toLowerCase() !== targetUser)
  );
  const isOwner = !isReceiver;

  const saveNames = useCallback(
    (next) => {
      setNames(next);
      try {
        localStorage.setItem(NAMES_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        /* storage unavailable */
      }
      if (user) {
        updateProfile({
          senderName: next.sender,
          recipientName: next.recipient,
          proposalNote: next.proposalNote,
        }).catch((err) => {
          console.warn("Could not sync profile:", err);
        });
      }
      setNamesOpen(false);
    },
    [user]
  );

  const handleSaveSingleText = useCallback(
    (textKey, newValue) => {
      if (!isOwner) return;
      setTexts((prev) => {
        const next = { ...prev, [textKey]: newValue };
        saveStoredTexts(next);
        return next;
      });
      if (user) {
        updateProfile({ customTexts: { [textKey]: newValue } }).catch((err) => {
          console.warn("Could not save text to backend:", err);
        });
      }
    },
    [isOwner, user]
  );

  const handleSaveAllTexts = useCallback(
    (allTexts) => {
      if (!isOwner) return;
      setTexts(allTexts);
      saveStoredTexts(allTexts);
      if (user) {
        updateProfile({ customTexts: allTexts }).catch((err) => {
          console.warn("Could not save all texts to backend:", err);
        });
      }
    },
    [isOwner, user]
  );

  const handleLoginSuccess = useCallback((loggedUser) => {
    setUser(loggedUser);
    if (loggedUser.senderName && loggedUser.recipientName) {
      setNames({
        sender: loggedUser.senderName,
        recipient: loggedUser.recipientName,
        proposalNote: loggedUser.proposalNote || DEFAULT_NAMES.proposalNote,
      });
    }
    if (loggedUser.customTexts) {
      setTexts((prev) => ({ ...prev, ...loggedUser.customTexts }));
    }
    // Fetch photos belonging strictly to this logged-in user
    fetchPhotos(loggedUser.username)
      .then((userPhotos) => {
        if (userPhotos) setPhotos(userPhotos);
      })
      .catch(() => {});
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    fetchPhotos()
      .then((generalPhotos) => {
        if (generalPhotos) setPhotos(generalPhotos);
      })
      .catch(() => {});
  }, []);

  const handleOpenNames = useCallback(() => {
    if (isOwner) setNamesOpen(true);
  }, [isOwner]);

  const handleOpenUpload = useCallback(() => {
    if (isOwner) setUploadOpen(true);
  }, [isOwner]);

  const handleAddPhoto = useCallback((newPhoto) => {
    setPhotos((prev) => {
      const updated = [newPhoto, ...prev];
      saveStoredPhotos(updated);
      return updated;
    });
  }, []);

  const handleDeletePhoto = useCallback(
    async (id) => {
      if (!isOwner) return;
      if (user) {
        try {
          await deletePhotoApi(id);
        } catch (err) {
          console.warn("Could not delete from cloud:", err);
        }
      }
      setPhotos((prev) => {
        const updated = prev.filter((p) => (p.id || p._id) !== id);
        saveStoredPhotos(updated);
        return updated;
      });
    },
    [isOwner, user]
  );

  // Receiver opens the letter: plays music and reveals letter smoothly without unwanted glitter/confetti overlay
  const handleOpenStoryFromLetter = useCallback(() => {
    setRevealOpen(false);
    playSong().catch(() => {});
  }, []);

  const currentSpecialMsg =
    specialMessage ||
    texts?.qrSpecialMessage ||
    "My love, every heartbeat of mine belongs to you. Open this letter to begin our forever story.";

  return (
    <div
      data-testid="app-root"
      className="grain relative min-h-screen bg-cream text-plum overflow-x-clip"
    >
      <FloatingHeartsCanvas />
      <ConfettiBurst active={celebrating} />

      <Header
        names={names}
        musicOn={musicOn}
        onToggleMusic={toggleMusic}
        onEditNames={handleOpenNames}
        onOpenQr={() => setQrOpen(true)}
        onOpenUpload={handleOpenUpload}
        user={user}
        onOpenLogin={() => setLoginOpen(true)}
        isOwner={isOwner}
        onOpenStoryEditor={() => setStoryEditorOpen(true)}
      />

      {/* Recipient Shared Delivery Notice */}
      <AnimatePresence>
        {sharedNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 inset-x-3 sm:inset-x-4 z-40 max-w-xl mx-auto"
          >
            <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-deeprose/95 backdrop-blur-md text-cream shadow-xl border border-rose/30 text-xs sm:text-sm font-mono tracking-wide">
              <div className="flex items-center gap-2">
                <Sparkles size={15} className="text-gold animate-pulse flex-shrink-0" />
                <span className="truncate max-w-[260px] sm:max-w-none">{sharedNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setSharedNotice(null)}
                className="text-cream/80 hover:text-cream p-1"
              >
                <X size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10">
        <Hero
          names={names}
          texts={texts}
          isOwner={isOwner}
          onSaveText={handleSaveSingleText}
        />
        <Marquee />
        <Manifesto
          texts={texts}
          isOwner={isOwner}
          onSaveText={handleSaveSingleText}
        />
        <MemoryGallery
          photos={photos}
          onOpenUpload={handleOpenUpload}
          onDeletePhoto={handleDeletePhoto}
          names={names}
          user={user}
          isOwner={isOwner}
          texts={texts}
          onSaveText={handleSaveSingleText}
        />
        <Question
          names={names}
          onYes={handleYes}
          isOwner={isOwner}
          onEditNames={handleOpenNames}
          texts={texts}
          onSaveText={handleSaveSingleText}
        />
      </main>

      <Footer
        names={names}
        onEditNames={handleOpenNames}
        onOpenQr={() => setQrOpen(true)}
        isOwner={isOwner}
        onOpenStoryEditor={() => setStoryEditorOpen(true)}
        texts={texts}
        onSaveText={handleSaveSingleText}
      />

      {/* Floating Re-Open Love Note Button for Receiver */}
      {isReceiver && !revealOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setRevealOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-deeprose text-cream px-4 py-2.5 text-xs font-mono shadow-[0_10px_25px_rgba(214,51,108,0.4)] hover:bg-[#b82357] transition-all hover:scale-105"
        >
          <Mail size={15} />
          <span>Read Love Note</span>
        </motion.button>
      )}

      {/* SPECIAL FIRST-LOOK REVEAL MODAL UPON QR SCAN */}
      <SpecialMessageRevealModal
        open={revealOpen}
        onClose={() => setRevealOpen(false)}
        onOpenStory={handleOpenStoryFromLetter}
        names={names}
        message={currentSpecialMsg}
      />

      <NamesModal
        open={namesOpen}
        names={names}
        onSave={saveNames}
        onClose={() => setNamesOpen(false)}
      />

      <StoryEditorModal
        open={storyEditorOpen}
        texts={texts}
        onSaveAll={handleSaveAllTexts}
        onClose={() => setStoryEditorOpen(false)}
      />

      <PhotoUploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onAddPhoto={handleAddPhoto}
        photos={photos}
        onDeletePhoto={handleDeletePhoto}
        user={user}
        onOpenLogin={() => setLoginOpen(true)}
      />

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        user={user}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
      />

      <QrModal
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        names={names}
        photos={photos}
        user={user}
        onOpenLogin={() => setLoginOpen(true)}
        texts={texts}
        onSaveText={handleSaveSingleText}
      />

      <CelebrationModal
        open={celebrating}
        names={names}
        texts={texts}
        onClose={() => setCelebrating(false)}
        onReplay={handleReplay}
      />
    </div>
  );
}
