import * as THREE from "three";

const INK = "#e8ebf0";
const ACCENT = "#9174dc";
let SANS = "'Helvetica Neue', Arial, sans-serif";
let MONO = "Menlo, monospace";
let DISPLAY = SANS;

/** Use the page's loaded font families when drawing screens. */
export function setScreenFonts({ sans, mono, display }) {
  if (sans) SANS = sans;
  if (mono) MONO = mono;
  if (display) DISPLAY = display;
}

function makeCanvas(w, h) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  return canvas;
}

function toTexture(canvas) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

const ACCRA = "Africa/Accra";

function paintWallpaper(ctx, w, h) {
  const base = ctx.createLinearGradient(0, 0, 0, h);
  base.addColorStop(0, "#1a1236");
  base.addColorStop(1, "#02040a");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);
  [
    [430, 300, 460, "rgba(115, 77, 213, 0.6)"],
    [90, 880, 420, "rgba(96, 72, 230, 0.32)"],
    [520, 1180, 320, "rgba(145, 116, 220, 0.2)"],
  ].forEach(([x, y, r, color]) => {
    const glow = ctx.createRadialGradient(x, y, 0, x, y, r);
    glow.addColorStop(0, color);
    glow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);
  });
}

function paintStatusBar(ctx, w) {
  ctx.fillStyle = INK;
  ctx.textAlign = "left";
  ctx.font = `600 26px ${SANS}`;
  ctx.fillText("MTN", 52, 66);
  [0, 1, 2, 3].forEach((i) => {
    roundRect(ctx, w - 168 + i * 11, 64 - (i + 1) * 5, 7, (i + 1) * 5, 2);
    ctx.fill();
  });
  ctx.lineWidth = 4;
  ctx.strokeStyle = INK;
  [8, 15].forEach((r) => {
    ctx.beginPath();
    ctx.arc(w - 106, 66, r, -Math.PI * 0.75, -Math.PI * 0.25);
    ctx.stroke();
  });
  roundRect(ctx, w - 82, 46, 40, 20, 6);
  ctx.lineWidth = 2;
  ctx.stroke();
  roundRect(ctx, w - 79, 49, 28, 14, 3);
  ctx.fill();
}

function paintClock(ctx, w, now) {
  const date = now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: ACCRA });
  const time = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: ACCRA });
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(232, 235, 240, 0.86)";
  ctx.font = `600 30px ${SANS}`;
  ctx.fillText(date, w / 2, 196);
  ctx.font = `600 150px ${DISPLAY}`;
  const scale = Math.min(1, 500 / ctx.measureText(time).width);
  ctx.font = `600 ${Math.round(150 * scale)}px ${DISPLAY}`;
  ctx.fillStyle = INK;
  ctx.fillText(time, w / 2, 360);
}

function paintWidgets(ctx) {
  roundRect(ctx, 72, 410, 300, 110, 30);
  ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
  ctx.fill();
  ctx.fillStyle = "#ffd36b";
  ctx.beginPath();
  ctx.arc(122, 465, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.textAlign = "left";
  ctx.fillStyle = INK;
  ctx.font = `600 34px ${SANS}`;
  ctx.fillText("29°  Accra", 160, 458);
  ctx.fillStyle = "rgba(232, 235, 240, 0.7)";
  ctx.font = `500 24px ${SANS}`;
  ctx.fillText("Sunny · H 31° L 24°", 160, 492);
  ctx.lineWidth = 10;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
  ctx.beginPath();
  ctx.arc(468, 465, 46, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "#34c759";
  ctx.beginPath();
  ctx.arc(468, 465, 46, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * 0.86);
  ctx.stroke();
  ctx.textAlign = "center";
  ctx.fillStyle = INK;
  ctx.font = `600 26px ${SANS}`;
  ctx.fillText("86", 468, 474);
}

function paintMessagesIcon(ctx, x, y, size) {
  roundRect(ctx, x, y, size, size, size * 0.24);
  ctx.fillStyle = "#34c759";
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.ellipse(x + size / 2, y + size * 0.47, size * 0.32, size * 0.26, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + size * 0.3, y + size * 0.62);
  ctx.lineTo(x + size * 0.24, y + size * 0.8);
  ctx.lineTo(x + size * 0.44, y + size * 0.68);
  ctx.fill();
}

function paintNotifications(ctx, arrive) {
  roundRect(ctx, 64, 1000, 472, 70, 40);
  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  ctx.fill();
  roundRect(ctx, 48, 984, 504, 70, 42);
  ctx.fillStyle = "rgba(255, 255, 255, 0.11)";
  ctx.fill();
  if (arrive <= 0) return;
  ctx.save();
  ctx.globalAlpha = arrive;
  ctx.translate(0, (1 - arrive) * 60);
  roundRect(ctx, 32, 790, 536, 186, 44);
  ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  ctx.stroke();
  paintMessagesIcon(ctx, 60, 822, 64);
  ctx.textAlign = "left";
  ctx.fillStyle = INK;
  ctx.font = `600 32px ${SANS}`;
  ctx.fillText("A founder", 146, 852);
  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(232, 235, 240, 0.6)";
  ctx.font = `500 24px ${SANS}`;
  ctx.fillText("now", 536, 852);
  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(232, 235, 240, 0.9)";
  ctx.font = `400 28px ${SANS}`;
  ctx.fillText("Hi Ammiel, quick question", 146, 896);
  ctx.fillText("about a product I'm building...", 146, 934);
  ctx.restore();
}

function paintLockControls(ctx, w, h) {
  [110, w - 110].forEach((x, i) => {
    ctx.fillStyle = "rgba(255, 255, 255, 0.14)";
    ctx.beginPath();
    ctx.arc(x, h - 150, 46, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = INK;
    if (i === 0) {
      roundRect(ctx, x - 9, h - 172, 18, 44, 5);
      ctx.fill();
    } else {
      roundRect(ctx, x - 22, h - 166, 44, 32, 7);
      ctx.fill();
      ctx.fillStyle = "#1a1d26";
      ctx.beginPath();
      ctx.arc(x, h - 150, 9, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  roundRect(ctx, w / 2 - 110, h - 36, 220, 10, 5);
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.fill();
}

/** iPhone lock screen; draw(arrive) slides the message in as the phone wakes (0 to 1). */
export function phoneScreen() {
  const canvas = makeCanvas(600, 1300);
  const ctx = canvas.getContext("2d");
  const texture = toTexture(canvas);
  let lastKey = "";
  function draw(arrive) {
    const now = new Date();
    const key = `${Math.round(arrive * 50)}-${now.getMinutes()}`;
    if (key === lastKey) return;
    lastKey = key;
    const { width: w, height: h } = canvas;
    paintWallpaper(ctx, w, h);
    paintStatusBar(ctx, w);
    paintClock(ctx, w, now);
    paintWidgets(ctx);
    paintNotifications(ctx, Math.round(arrive * 50) / 50);
    paintLockControls(ctx, w, h);
    texture.needsUpdate = true;
  }
  draw(0);
  return { texture, draw };
}

/** Small LED display on the desk's height keypad. */
export function keypadDisplay() {
  const canvas = makeCanvas(256, 96);
  const ctx = canvas.getContext("2d");
  const texture = toTexture(canvas);
  let shown = null;
  function set(cm) {
    const value = cm.toFixed(1);
    if (value === shown) return;
    shown = value;
    ctx.fillStyle = "#050607";
    ctx.fillRect(0, 0, 256, 96);
    ctx.fillStyle = "#b9a6ee";
    ctx.font = `600 64px ${MONO}`;
    ctx.textAlign = "center";
    ctx.fillText(value, 128, 72);
    texture.needsUpdate = true;
  }
  return { texture, set };
}

/** Soft radial blob used as a fake contact shadow. */
export function shadowTexture() {
  const canvas = makeCanvas(256, 256);
  const ctx = canvas.getContext("2d");
  const g = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
  g.addColorStop(0, "rgba(0,0,0,0.85)");
  g.addColorStop(0.5, "rgba(0,0,0,0.35)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(canvas);
}

/** Repeating 2x2 twill carbon-fibre weave: colour and bump textures, CELLS x CELLS tows per tile. */
export function carbonFibre(cells = 8, size = 512) {
  const color = makeCanvas(size, size);
  const bump = makeCanvas(size, size);
  const c = color.getContext("2d");
  const b = bump.getContext("2d");
  const cell = size / cells;
  for (let i = 0; i < cells; i += 1) {
    for (let j = 0; j < cells; j += 1) {
      const across = (i + j) % 4 < 2;
      const x = i * cell;
      const y = j * cell;
      const sheen = across ? c.createLinearGradient(x, y, x, y + cell) : c.createLinearGradient(x, y, x + cell, y);
      sheen.addColorStop(0, "#050506");
      sheen.addColorStop(0.5, across ? "#17181b" : "#0f1012");
      sheen.addColorStop(1, "#050506");
      c.fillStyle = sheen;
      c.fillRect(x, y, cell, cell);
      const height = across ? b.createLinearGradient(x, y, x, y + cell) : b.createLinearGradient(x, y, x + cell, y);
      height.addColorStop(0, "#606060");
      height.addColorStop(0.5, "#ffffff");
      height.addColorStop(1, "#606060");
      b.fillStyle = height;
      b.fillRect(x, y, cell, cell);
      c.strokeStyle = "rgba(255, 255, 255, 0.02)";
      c.lineWidth = 1;
      for (let f = 3; f < cell; f += 4) {
        c.beginPath();
        if (across) {
          c.moveTo(x, y + f);
          c.lineTo(x + cell, y + f);
        } else {
          c.moveTo(x + f, y);
          c.lineTo(x + f, y + cell);
        }
        c.stroke();
      }
    }
  }
  const map = toTexture(color);
  const bumpMap = new THREE.CanvasTexture(bump);
  [map, bumpMap].forEach((texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.anisotropy = 16;
  });
  return { map, bumpMap };
}

/** Soft round glow with a little noise in it, so a dark gradient doesn't band into rings. */
export function wallGlow(size = 512) {
  const canvas = makeCanvas(size, size);
  const ctx = canvas.getContext("2d");
  const glow = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  glow.addColorStop(0, "rgba(255, 255, 255, 1)");
  glow.addColorStop(0.35, "rgba(255, 255, 255, 0.45)");
  glow.addColorStop(0.7, "rgba(255, 255, 255, 0.1)");
  glow.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, size, size);
  const image = ctx.getImageData(0, 0, size, size);
  for (let i = 0; i < image.data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 6;
    image.data[i + 3] = Math.max(0, Math.min(255, image.data[i + 3] + noise));
  }
  ctx.putImageData(image, 0, 0);
  return toTexture(canvas);
}
