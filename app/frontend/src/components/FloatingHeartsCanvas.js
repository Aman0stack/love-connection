import { useEffect, useRef } from "react";

const COLORS = ["255,122,156", "214,51,108", "227,178,60", "255,201,214"];

export default function FloatingHeartsCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let w = 0;
    let h = 0;
    let hearts = [];
    let raf = 0;
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = () => {
      hearts = Array.from({ length: 22 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        s: 8 + Math.random() * 16,
        vy: 0.15 + Math.random() * 0.35,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 0.004 + Math.random() * 0.008,
        rot: (Math.random() - 0.5) * 0.5,
        c: COLORS[(Math.random() * COLORS.length) | 0],
        a: 0.08 + Math.random() * 0.16,
        vx: 0,
      }));
    };

    const heartPath = (s) => {
      ctx.beginPath();
      ctx.moveTo(0, s * 0.35);
      ctx.bezierCurveTo(-s * 0.55, -s * 0.15, -s * 1.05, s * 0.35, 0, s * 1.05);
      ctx.bezierCurveTo(s * 1.05, s * 0.35, s * 0.55, -s * 0.15, 0, s * 0.35);
      ctx.closePath();
    };

    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of hearts) {
        p.sway += p.swaySpeed;
        p.y -= p.vy;
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < 130 && d > 0.01) p.vx += (dx / d) * 0.06;
        p.vx *= 0.94;
        p.x += Math.sin(p.sway) * 0.35 + p.vx;
        if (p.y < -50) {
          p.y = h + 40;
          p.x = Math.random() * w;
          p.vx = 0;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot + Math.sin(p.sway) * 0.12);
        ctx.fillStyle = `rgba(${p.c},${p.a})`;
        heartPath(p.s);
        ctx.fill();
        ctx.restore();
      }
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    resize();
    spawn();
    loop();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      data-testid="floating-hearts-canvas"
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
}
