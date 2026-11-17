import * as THREE from "three";

const SCREEN_BG = "#0b0d12";
const INK = "#e8ebf0";
const MUTED = "#8a93a3";
const ACCENT = "#3d7fff";
let SANS = "'Helvetica Neue', Arial, sans-serif";
let MONO = "Menlo, monospace";

/** Use the page's loaded font families when drawing screens. */
export function setScreenFonts({ sans, mono }) {
  if (sans) SANS = sans;
  if (mono) MONO = mono;
}

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
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

function drawCover(ctx, img, x, y, w, h, r) {
  ctx.save();
  roundRect(ctx, x, y, w, h, r);
  ctx.clip();
  ctx.fillStyle = "#1a1d24";
  ctx.fillRect(x, y, w, h);
  if (img) {
    const scale = Math.max(w / img.width, h / img.height);
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
  }
  ctx.restore();
}

function drawWindowChrome(ctx, w, title) {
  ctx.fillStyle = SCREEN_BG;
  ctx.fillRect(0, 0, w, ctx.canvas.height);
  ctx.fillStyle = "#151821";
  ctx.fillRect(0, 0, w, 64);
  ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(36 + i * 30, 32, 9, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = MUTED;
  ctx.font = `500 24px ${MONO}`;
  ctx.textAlign = "center";
  ctx.fillText(title, w / 2, 40);
  ctx.textAlign = "left";
}

/** Grid of every project thumbnail, sized so all rows and labels fit the canvas. */
async function drawGrid(canvas, { title, items, columns }) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  drawWindowChrome(ctx, w, title);
  const pad = w * 0.045;
  const gap = w * 0.018;
  const labelH = Math.round(w * 0.03);
  const top = 64 + pad * 0.8;
  const rows = Math.max(1, Math.ceil(items.length / columns));
  const fitW = (w - pad * 2 - gap * (columns - 1)) / columns;
  const fitH = (h - top - pad * 0.6 - rows * (labelH + gap)) / rows;
  const cellH = Math.min(fitW * 0.62, fitH);
  const cellW = cellH / 0.62;
  const left = (w - (cellW * columns + gap * (columns - 1))) / 2;
  const images = await Promise.all(items.map((item) => loadImage(item.imgSrc)));
  items.forEach((item, i) => {
    const x = left + (i % columns) * (cellW + gap);
    const y = top + Math.floor(i / columns) * (cellH + labelH + gap);
    drawCover(ctx, images[i], x, y, cellW, cellH, 12);
    ctx.fillStyle = INK;
    ctx.font = `500 ${Math.round(labelH * 0.55)}px ${SANS}`;
    ctx.fillText(item.name, x, y + cellH + labelH * 0.72);
  });
}

export async function workScreen(items) {
  const canvas = makeCanvas(2048, 1152);
  const texture = toTexture(canvas);
  await drawGrid(canvas, { title: "~/work", items, columns: Math.max(3, Math.round(Math.sqrt(items.length * 1.6))) });
  texture.needsUpdate = true;
  return texture;
}

export async function toolsScreen(items) {
  const canvas = makeCanvas(1600, 1000);
  const texture = toTexture(canvas);
  await drawGrid(canvas, { title: "~/tools", items, columns: Math.min(3, Math.max(1, items.length)) });
  texture.needsUpdate = true;
  return texture;
}

/** Phone lock screen with a message notification. */
export function phoneScreen() {
  const canvas = makeCanvas(600, 1240);
  const ctx = canvas.getContext("2d");
  const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
  g.addColorStop(0, "#0d1f45");
  g.addColorStop(1, "#05070c");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = INK;
  ctx.textAlign = "center";
  ctx.font = `300 150px ${SANS}`;
  const now = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Accra" });
  ctx.fillText(now, 300, 300);
  ctx.font = `500 30px ${SANS}`;
  ctx.fillStyle = "#b9c3d6";
  ctx.fillText("Accra", 300, 360);
  roundRect(ctx, 36, 520, 528, 210, 36);
  ctx.fillStyle = "rgba(255,255,255,0.14)";
  ctx.fill();
  ctx.textAlign = "left";
  ctx.fillStyle = ACCENT;
  ctx.font = `600 26px ${MONO}`;
  ctx.fillText("NEW MESSAGE", 72, 580);
  ctx.fillStyle = INK;
  ctx.font = `600 40px ${SANS}`;
  ctx.fillText("Message Ammiel", 72, 640);
  ctx.fillStyle = "#c7cfdd";
  ctx.font = `400 30px ${SANS}`;
  ctx.fillText("Hi Ammiel, quick question about...", 72, 690);
  return toTexture(canvas);
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

export const SCREEN_COLOR = SCREEN_BG;
