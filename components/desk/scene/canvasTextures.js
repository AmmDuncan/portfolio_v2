import * as THREE from "three";

const SANS = "'Helvetica Neue', Arial, sans-serif";
/** Font families used when a texture draws text; pass the page's loaded families to override any of them. */
export const DEFAULT_FONTS = { sans: SANS, mono: "Menlo, monospace", display: SANS };

/** DEFAULT_FONTS with any provided, non-empty family swapped in. */
export function resolveFonts(fonts = {}) {
  return { ...DEFAULT_FONTS, ...Object.fromEntries(Object.entries(fonts).filter(([, family]) => family)) };
}

export function makeCanvas(w, h) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  return canvas;
}

export function toTexture(canvas) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

export function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

/** Small LED display on the desk's height keypad. */
export function keypadDisplay(fonts) {
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
    ctx.font = `600 64px ${fonts.mono}`;
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
