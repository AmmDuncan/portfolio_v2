import * as THREE from "three";

const INK = "#e8ebf0";
const ACCENT = "#3d7fff";
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
  base.addColorStop(0, "#0a1633");
  base.addColorStop(1, "#02040a");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);
  [
    [430, 300, 460, "rgba(61, 127, 255, 0.55)"],
    [90, 880, 420, "rgba(96, 72, 230, 0.32)"],
    [520, 1180, 320, "rgba(40, 190, 255, 0.18)"],
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
  ctx.fillText("You", 146, 852);
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
    ctx.fillStyle = "#7fb2ff";
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

