import * as THREE from "three";

/** CSS matrix3d that maps an element onto a screen quad (top-left, top-right, bottom-right, bottom-left). */
function quadMatrix(width, height, [p0, p1, p2, p3]) {
  const dx1 = p1.x - p2.x;
  const dx2 = p3.x - p2.x;
  const dx3 = p0.x - p1.x + p2.x - p3.x;
  const dy1 = p1.y - p2.y;
  const dy2 = p3.y - p2.y;
  const dy3 = p0.y - p1.y + p2.y - p3.y;
  const det = dx1 * dy2 - dx2 * dy1;
  const g = (dx3 * dy2 - dx2 * dy3) / det;
  const h = (dx1 * dy3 - dx3 * dy1) / det;
  const a = p1.x - p0.x + g * p1.x;
  const b = p3.x - p0.x + h * p3.x;
  const d = p1.y - p0.y + g * p1.y;
  const e = p3.y - p0.y + h * p3.y;
  const m = [a / width, d / width, 0, g / width, b / height, e / height, 0, h / height, 0, 0, 1, 0, p0.x, p0.y, 0, 1];
  return `matrix3d(${m.join(",")})`;
}

const PINNED_STYLE = { position: "absolute", left: "0", top: "0", transformOrigin: "0 0", pointerEvents: "auto" };

/**
 * DOM elements pinned onto scene meshes. `screens` is { [key]: { mesh, size, element } } (size = the mesh's world
 * width and height); each element must be given its pixel size with setSize before the first sync.
 */
export function createDomScreens({ cssHost, camera, screens }) {
  const pinned = Object.fromEntries(
    Object.entries(screens).map(([key, { mesh, size, element }]) => {
      Object.assign(element.style, PINNED_STYLE);
      cssHost.appendChild(element);
      return [key, { mesh, size, element, width: 0, height: 0, corners: [0, 1, 2, 3].map(() => new THREE.Vector3()) }];
    }),
  );
  const viewport = { width: 1, height: 1 };
  const tmpPosition = new THREE.Vector3();
  const tmpQuaternion = new THREE.Quaternion();
  const tmpScale = new THREE.Vector3();
  const screenMatrix = new THREE.Matrix4();
  const unitScale = new THREE.Vector3(1, 1, 1);
  const cornerSigns = [[-1, 1], [1, 1], [1, -1], [-1, -1]];

  /** The pixel size an element has been given; its aspect decides the quad's height. */
  function setSize(key, width, height) {
    pinned[key].width = width;
    pinned[key].height = height;
  }

  function setViewport(width, height) {
    viewport.width = width;
    viewport.height = height;
  }

  /** Projects each mesh corner and warps its element with one matrix3d (a CSS 3D context breaks in WebKit). */
  function sync() {
    Object.values(pinned).forEach(({ mesh, size, element, corners, width, height }) => {
      if (!width) return;
      const halfWidth = size[0] / 2;
      const halfHeight = (size[0] * height) / width / 2;
      mesh.matrixWorld.decompose(tmpPosition, tmpQuaternion, tmpScale);
      screenMatrix.compose(tmpPosition, tmpQuaternion, unitScale);
      const visible = corners.every((corner, i) => {
        corner.set(cornerSigns[i][0] * halfWidth, cornerSigns[i][1] * halfHeight, 0).applyMatrix4(screenMatrix);
        const inFront = corner.clone().applyMatrix4(camera.matrixWorldInverse).z < -camera.near;
        corner.project(camera);
        corner.set(((corner.x + 1) / 2) * viewport.width, ((1 - corner.y) / 2) * viewport.height, 0);
        return inFront;
      });
      element.style.visibility = visible ? "" : "hidden";
      if (visible) element.style.transform = quadMatrix(width, height, corners);
    });
  }

  function dispose() {
    Object.values(pinned).forEach(({ element }) => element.remove());
  }

  return { setSize, setViewport, sync, dispose };
}
