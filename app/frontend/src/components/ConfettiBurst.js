import { useEffect, useRef } from "react";

const COLORS = ["#e3b23c", "#ff7a9c", "#d6336c", "#ffc9d6", "#fff6f2", "#f5cf6b"];

export default function ConfettiBurst({ active }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!active || !canvas) {
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return undefined;
    }

    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let particles = [];
    let raf = 0;

    const burst = (x, y, angle, spread, count, power) => {
      for (let i = 0; i < count; i += 1) {
        const a = angle + (Math.random() - 0.5) * spread;
        const sp = power * (0.5 + Math.random() * 0.8);
        particles.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          s: 5 + Math.random() * 8,
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.3,
          c: COLORS[(Math.random() * COLORS.length) | 0],
          shape: Math.random() < 0.3 ? "heart" : Math.random() < 0.5 ? "rect" : "circle",
          life: 1,
          decay: 0.003 + Math.random() * 0.004,
        });
      }
    };

    const heartPath = (s) => {
      ctx.beginPath();
      ctx.moveTo(0, s * 0.35);
      ctx.bezierCurveTo(-s * 0.55, -s * 0.15, -s * 1.05, s * 0.35, 0, s * 1.05);
      ctx.bezierCurveTo(s * 1.05, s * 0.35, s * 0.55, -s * 0.15, 0, s * 0.35);
      ctx.closePath();
    };

    burst(0, h, -Math.PI / 3, 0.6, 90, 16);
    burst(w, h, (-Math.PI * 2) / 3, 0.6, 90, 16);
    burst(w / 2, h * 0.9, -Math.PI / 2, 1.4, 70, 14);
    const t1 = setTimeout(() => burst(w * 0.25, h * 0.8, -Math.PI / 2.4, 0.8, 60, 13), 350);
    const t2 = setTimeout(() => burst(w * 0.75, h * 0.8, -Math.PI / 1.7, 0.8, 60, 13), 700);

    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      particles = particles.filter((p) => p.life > 0 && p.y < h + 60);
      for (const p of particles) {
        p.vy += 0.16;
        p.vx *= 0.99;
        p.vy *= 0.995;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.life -= p.decay;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = Math.max(p.life, 0);
        ctx.fillStyle = p.c;
        if (p.shape === "heart") {
          heartPath(p.s * 0.8);
          ctx.fill();
        } else if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.s / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
        }
        ctx.restore();
      }
      if (particles.length) {
        raf = requestAnimationFrame(loop);
      } else {
        ctx.clearRect(0, 0, w, h);
      }
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
      if (canvas) {
        const c = canvas.getContext("2d");
        if (c) c.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={ref}
      data-testid="confetti-canvas"
      aria-hidden="true"
      className="fixed inset-0 z-[80] pointer-events-none"
    />
  );
}
