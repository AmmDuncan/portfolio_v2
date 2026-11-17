import * as THREE from "three";

function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function glow(ctx, x, y, r, color, alpha) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color.replace("ALPHA", String(alpha)));
  g.addColorStop(1, color.replace("ALPHA", "0"));
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
}

/** Accra rooftops at night: low blocks, polytanks, a mast, window lights, street-lamp haze. */
export function accraNightTexture() {
  const W = 2048;
  const H = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  const rand = seeded(23);

  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, "#03060f");
  sky.addColorStop(0.55, "#0b1226");
  sky.addColorStop(0.8, "#1c1a24");
  sky.addColorStop(1, "#2a2026");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);
  glow(ctx, W * 0.55, H * 1.05, W * 0.6, "rgba(255,170,100,ALPHA)", 0.12);

  for (let i = 0; i < 70; i++) {
    ctx.fillStyle = `rgba(220,230,255,${0.15 + rand() * 0.35})`;
    ctx.fillRect(rand() * W, rand() * H * 0.45, 1.5, 1.5);
  }

  const horizon = H * 0.4;
  function block(x, w, h, shade) {
    ctx.fillStyle = shade;
    ctx.fillRect(x, horizon - h + H * 0.4 * 0, w, h + H);
    const cols = Math.floor(w / 22);
    const rows = Math.floor((H - horizon + h) / 26);
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        if (rand() > 0.16) continue;
        const warm = rand() > 0.35;
        const wx = x + 8 + c * 22;
        const wy = horizon - h + 10 + r * 26;
        const color = warm ? `rgba(255,${185 + Math.round(rand() * 40)},${110 + Math.round(rand() * 40)},ALPHA)` : "rgba(185,210,255,ALPHA)";
        glow(ctx, wx + 4, wy + 5, 14, color, 0.35);
        ctx.fillStyle = color.replace("ALPHA", String(0.7 + rand() * 0.3));
        ctx.fillRect(wx, wy, 8, 10);
      }
    }
    if (rand() > 0.45) {
      const tx = x + 10 + rand() * Math.max(10, w - 50);
      ctx.fillStyle = "#05060a";
      ctx.fillRect(tx, horizon - h - 34, 30, 34);
      ctx.beginPath();
      ctx.ellipse(tx + 15, horizon - h - 34, 15, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  let x = -40;
  while (x < W) {
    const w = 90 + rand() * 210;
    const h = 60 + rand() * 170;
    block(x, w, h, rand() > 0.5 ? "#06070c" : "#08090f");
    x += w - 6;
  }
  const mastX = W * 0.62;
  ctx.strokeStyle = "#0a0b10";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(mastX, horizon);
  ctx.lineTo(mastX, horizon - 420);
  ctx.stroke();
  glow(ctx, mastX, horizon - 420, 22, "rgba(255,60,60,ALPHA)", 0.9);

  x = -60;
  while (x < W) {
    const w = 140 + rand() * 260;
    const h = 20 + rand() * 90;
    ctx.fillStyle = "#040508";
    ctx.fillRect(x, H * 0.78 - h, w, H);
    x += w - 10;
  }
  for (let i = 0; i < 60; i++) {
    const lx = rand() * W;
    const ly = H * (0.5 + rand() * 0.45);
    const warm = rand() > 0.3;
    glow(ctx, lx, ly, 18 + rand() * 46, warm ? "rgba(255,180,90,ALPHA)" : "rgba(200,220,255,ALPHA)", 0.35 + rand() * 0.4);
  }

  const soft = document.createElement("canvas");
  soft.width = W;
  soft.height = H;
  const softCtx = soft.getContext("2d");
  softCtx.filter = "blur(3px)";
  softCtx.drawImage(canvas, 0, 0);
  const texture = new THREE.CanvasTexture(soft);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
