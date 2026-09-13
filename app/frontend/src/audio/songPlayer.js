let audioInstance = null;
let isPlaying = false;
let listeners = new Set();
let initializedInteraction = false;

function getAudio() {
  if (!audioInstance) {
    audioInstance = new Audio('/background-song.mp3');
    audioInstance.loop = true;
    audioInstance.volume = 0.65;
    audioInstance.preload = 'auto';

    audioInstance.addEventListener('play', () => {
      isPlaying = true;
      notify();
    });

    audioInstance.addEventListener('pause', () => {
      isPlaying = false;
      notify();
    });

    audioInstance.addEventListener('ended', () => {
      isPlaying = false;
      notify();
    });
  }
  return audioInstance;
}

function notify() {
  listeners.forEach((cb) => cb(isPlaying));
}

export function playSong() {
  const a = getAudio();
  return a.play().then(() => {
    isPlaying = true;
    notify();
  }).catch((err) => {
    console.warn('[Audio] Autoplay delayed until user interaction:', err.message);
  });
}

export function pauseSong() {
  const a = getAudio();
  a.pause();
  isPlaying = false;
  notify();
}

export function toggleSong() {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
  return !isPlaying;
}

export function isSongPlaying() {
  return isPlaying;
}

export function addSongListener(cb) {
  listeners.add(cb);
  cb(isPlaying);
  return () => listeners.delete(cb);
}

// Automatically start playing on first gentle touch/click/scroll if desired
export function enableAutoPlayOnInteraction() {
  if (initializedInteraction || typeof window === 'undefined') return;
  initializedInteraction = true;

  const onFirstTouch = () => {
    if (!isPlaying) {
      playSong();
    }
    window.removeEventListener('click', onFirstTouch);
    window.removeEventListener('touchstart', onFirstTouch);
    window.removeEventListener('keydown', onFirstTouch);
  };

  window.addEventListener('click', onFirstTouch, { once: true, passive: true });
  window.addEventListener('touchstart', onFirstTouch, { once: true, passive: true });
  window.addEventListener('keydown', onFirstTouch, { once: true, passive: true });
}
