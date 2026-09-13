let audioCtx = null;
let master = null;
let timer = null;
let step = 0;
let isPlaying = false;

const SEQ = [
  440.0, 587.33, 739.99, 587.33, 493.88, 587.33, 440.0, 369.99,
  329.63, 369.99, 440.0, 493.88, 587.33, 493.88, 440.0, 369.99,
];
const STEP_MS = 420;

function ensureCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    master = audioCtx.createGain();
    master.gain.value = 0.5;
    const lp = audioCtx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 2400;
    const delay = audioCtx.createDelay(1);
    delay.delayTime.value = 0.36;
    const fb = audioCtx.createGain();
    fb.gain.value = 0.32;
    const wet = audioCtx.createGain();
    wet.gain.value = 0.22;
    master.connect(lp);
    lp.connect(audioCtx.destination);
    lp.connect(delay);
    delay.connect(fb);
    fb.connect(delay);
    delay.connect(wet);
    wet.connect(audioCtx.destination);
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
}

function note(freq, time, dur = 1.9, vol = 0.16) {
  const o1 = audioCtx.createOscillator();
  o1.type = "sine";
  o1.frequency.value = freq;
  const o2 = audioCtx.createOscillator();
  o2.type = "triangle";
  o2.frequency.value = freq * 2;
  const g2 = audioCtx.createGain();
  g2.gain.value = 0.16;
  const g = audioCtx.createGain();
  g.gain.setValueAtTime(0, time);
  g.gain.linearRampToValueAtTime(vol, time + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
  o1.connect(g);
  o2.connect(g2);
  g2.connect(g);
  g.connect(master);
  o1.start(time);
  o2.start(time);
  o1.stop(time + dur + 0.1);
  o2.stop(time + dur + 0.1);
}

function tick() {
  const t = audioCtx.currentTime + 0.05;
  note(SEQ[step % SEQ.length], t);
  if (step % 8 === 0) note(SEQ[step % SEQ.length] / 2, t, 3.4, 0.07);
  step += 1;
}

export const musicBox = {
  start() {
    ensureCtx();
    if (isPlaying) return;
    isPlaying = true;
    step = 0;
    tick();
    timer = setInterval(tick, STEP_MS);
  },
  stop() {
    isPlaying = false;
    if (timer) clearInterval(timer);
    timer = null;
  },
};

export function playCelebration() {
  ensureCtx();
  const t0 = audioCtx.currentTime + 0.05;
  const run = [293.66, 369.99, 440.0, 587.33, 739.99, 880.0];
  run.forEach((f, i) => note(f, t0 + i * 0.11, 2.4, 0.18));
  [587.33, 739.99, 880.0].forEach((f) => note(f, t0 + 0.78, 3.6, 0.16));
}
