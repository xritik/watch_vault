import { useEffect, useRef } from 'react';

function hColor() {
  const s = getComputedStyle(document.documentElement);
  return [
    s.getPropertyValue('--heart1').trim() || '#ff6b9d',
    s.getPropertyValue('--heart2').trim() || '#ff4d6d',
    s.getPropertyValue('--heart3').trim() || '#ffc2d1',
  ];
}

function mkH(canvasW, canvasH, x, y) {
  const c = hColor();
  return {
    x:   x ?? Math.random() * canvasW,
    y:   y ?? canvasH + 20,
    sz:  Math.random() * 14 + 6,
    sp:  Math.random() * 1 + 0.4,
    op:  Math.random() * 0.4 + 0.15,
    cl:  c[Math.floor(Math.random() * 3)],
    dr:  (Math.random() - 0.5) * 0.5,
    ang: Math.random() * Math.PI * 2,
    spn: (Math.random() - 0.5) * 0.025,
  };
}

function drawH(ctx, cx, cy, s, a, cl, op) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(a);
  ctx.globalAlpha = op;
  const r = s * 0.5;
  ctx.beginPath();
  ctx.moveTo(0, r * 0.6);
  ctx.bezierCurveTo(r, -r * 0.2, r * 1.6, -r * 1.2, 0, -r * 0.8);
  ctx.bezierCurveTo(-r * 1.6, -r * 1.2, -r, -r * 0.2, 0, r * 0.6);
  ctx.fillStyle   = cl;
  ctx.shadowColor = cl;
  ctx.shadowBlur  = s * 1.2;
  ctx.fill();
  ctx.restore();
}

export function useHeartsCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let hearts = [];
    let animId;

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    hearts = Array.from({ length: 25 }, () => {
      const h = mkH(canvas.width, canvas.height);
      h.y = Math.random() * canvas.height;
      return h;
    });

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      hearts.forEach((h, i) => {
        h.y   -= h.sp;
        h.x   += h.dr;
        h.ang += h.spn;
        drawH(ctx, h.x, h.y, h.sz, h.ang, h.cl, h.op);
        if (h.y < -20) hearts[i] = mkH(canvas.width, canvas.height);
      });
      animId = requestAnimationFrame(animate);
    }
    animate();

    function onClick(e) {
      for (let i = 0; i < 4; i++) {
        const h = mkH(canvas.width, canvas.height, e.clientX + (Math.random() - 0.5) * 20, e.clientY);
        h.sp = Math.random() * 3 + 1.5;
        h.op = 0.7;
        hearts.push(h);
      }
    }
    document.addEventListener('click', onClick);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('click', onClick);
    };
  }, []);

  return canvasRef;
}
