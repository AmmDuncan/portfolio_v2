import * as THREE from "three";

const INK = "#e8ebf0";
const ACCENT = "#3d7fff";
let SANS = "'Helvetica Neue', Arial, sans-serif";
let MONO = "Menlo, monospace";

/** Use the page's loaded font families when drawing screens. */
export function setScreenFonts({ sans, mono }) {
  if (sans) SANS = sans;
  if (mono) MONO = mono;
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
  ctx.fillText("You", 72, 640);
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

