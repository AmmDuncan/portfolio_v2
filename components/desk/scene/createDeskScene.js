import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { CSS3DObject, CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { keypadDisplay, phoneScreen, shadowTexture } from "./screens";

const SIT_HEIGHT = 0.74;
const STAND_HEIGHT = 1.12;
const DESK = { width: 1.6, depth: 0.75, thickness: 0.035 };
const ACCENT = new THREE.Color("#3d7fff");
const MODEL_URLS = { monitor: "/models/g7.glb", laptop: "/models/macbook.glb", controller: "/models/dualsense.glb" };
// Flat DOM plane sized past the curved panel's chord so the curve's edges never show a gap.
const MONITOR_SCREEN = [0.75, 0.4];
const LAPTOP_SCREEN = [0.35, 0.226];

const mat = {
  deskTop: new THREE.MeshStandardMaterial({ color: "#131315", roughness: 0.62, dithering: true }),
  frame: new THREE.MeshStandardMaterial({ color: "#1b1b1e", roughness: 0.42, metalness: 0.6 }),
  wall: new THREE.MeshStandardMaterial({ color: "#b9bcbf", roughness: 0.95, dithering: true }),
  floor: new THREE.MeshStandardMaterial({ color: "#1d1c1b", roughness: 0.9, dithering: true }),
  aluminium: new THREE.MeshStandardMaterial({ color: "#5e6166", roughness: 0.34, metalness: 0.9 }),
  blackPlastic: new THREE.MeshStandardMaterial({ color: "#0e0e10", roughness: 0.5 }),
  switchPlate: new THREE.MeshStandardMaterial({ color: "#e4e1d8", roughness: 0.7 }),
  bookEdge: new THREE.MeshStandardMaterial({ color: "#ece9e2", roughness: 0.9 }),
};

function box(w, h, d, material, radius = 0.004) {
  const mesh = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, Math.min(radius, w / 2, h / 2, d / 2)), material);
  return mesh;
}

/** Turns a model's screen into a see-through cut in the canvas, so the DOM screen behind it shows. */
function cutScreenHole(model) {
  const material = new THREE.MeshBasicMaterial({ color: 0x000000, opacity: 0, blending: THREE.NoBlending });
  model.getObjectByName("Screen").traverse((node) => {
    if (node.isMesh) node.material = material;
  });
}

function contactShadow(texture, w, d, opacity = 0.7) {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(w, d),
    new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity, depthWrite: false }),
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0.0015;
  return mesh;
}

function buildRoom(scene) {
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(8, 4), mat.wall);
  wall.position.set(0, 2, -0.42);
  scene.add(wall);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), mat.floor);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);
  const plate = box(0.085, 0.085, 0.012, mat.switchPlate, 0.004);
  plate.position.set(-0.98, 1.42, -0.414);
  const rocker = box(0.022, 0.034, 0.012, mat.switchPlate, 0.003);
  rocker.position.set(-0.98, 1.42, -0.405);
  rocker.rotation.x = 0.12;
  scene.add(plate, rocker);
}

function buildFrame(shadowTex) {
  const base = new THREE.Group();
  const inner = new THREE.Group();
  [-0.7, 0.7].forEach((x) => {
    const foot = box(0.075, 0.03, 0.66, mat.frame, 0.008);
    foot.position.set(x, 0.015, 0);
    const outer = box(0.08, 0.42, 0.06, mat.frame, 0.006);
    outer.position.set(x, 0.24, 0);
    base.add(foot, outer);
    const column = box(0.066, 0.76, 0.05, mat.frame, 0.005);
    column.position.set(x, -0.38, 0);
    inner.add(column);
  });
  const crossbar = box(1.36, 0.05, 0.04, mat.frame, 0.006);
  crossbar.position.set(0, -0.045, -0.1);
  inner.add(crossbar);
  const floorShadow = contactShadow(shadowTex, 2.1, 1.1, 0.9);
  base.add(floorShadow);
  return { base, inner };
}

function buildMonitor(model, shadowTex) {
  const group = new THREE.Group();
  cutScreenHole(model);
  const screen = model.getObjectByName("ScreenCenter");
  group.add(model, contactShadow(shadowTex, 0.72, 0.4));
  return { group, screen, size: MONITOR_SCREEN };
}

function buildLaptop(model, shadowTex) {
  const group = new THREE.Group();
  cutScreenHole(model);
  const screen = new THREE.Object3D();
  screen.position.set(0, 0.1647, -0.1595);
  screen.rotation.x = -Math.atan2(0.247, 0.969);
  group.add(model, screen, contactShadow(shadowTex, 0.46, 0.4, 0.6));
  return { group, screen, size: LAPTOP_SCREEN };
}

function buildPhone(shadowTex) {
  const group = new THREE.Group();
  const standBase = box(0.08, 0.008, 0.07, mat.aluminium, 0.003);
  standBase.position.set(0, 0.004, 0);
  const tilt = new THREE.Group();
  tilt.position.set(0, 0.012, -0.012);
  tilt.rotation.x = -0.3;
  const body = box(0.076, 0.158, 0.008, mat.blackPlastic, 0.008);
  body.position.set(0, 0.079, 0);
  const screenMaterial = new THREE.MeshBasicMaterial({ map: phoneScreen(), color: "#000000", toneMapped: false });
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 0.15), screenMaterial);
  screen.position.set(0, 0.079, 0.0042);
  tilt.add(body, screen);
  group.add(standBase, tilt, contactShadow(shadowTex, 0.14, 0.12, 0.6));
  return { group, screen, screenMaterial };
}

function buildController(model, shadowTex) {
  const group = new THREE.Group();
  group.add(model, contactShadow(shadowTex, 0.24, 0.17, 0.65));
  return group;
}

function buildGuides(shadowTex, covers) {
  const group = new THREE.Group();
  const loader = new THREE.TextureLoader();
  covers.forEach((src, i) => {
    const cover = loader.load(src);
    cover.colorSpace = THREE.SRGBColorSpace;
    cover.anisotropy = 8;
    const top = new THREE.MeshStandardMaterial({ map: cover, roughness: 0.6 });
    const book = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.012, 0.146), [
      mat.bookEdge, mat.bookEdge, top, mat.bookEdge, mat.bookEdge, mat.bookEdge,
    ]);
    book.position.set(i * 0.006, 0.006 + i * 0.0125, -i * 0.004);
    book.rotation.y = i * 0.05;
    group.add(book);
  });
  group.add(contactShadow(shadowTex, 0.36, 0.24, 0.6));
  return group;
}

function buildKeypad() {
  const display = keypadDisplay();
  const group = new THREE.Group();
  const body = box(0.09, 0.022, 0.03, mat.blackPlastic, 0.004);
  const led = new THREE.Mesh(new THREE.PlaneGeometry(0.034, 0.013), new THREE.MeshBasicMaterial({ map: display.texture, toneMapped: false }));
  led.position.set(-0.016, 0, 0.0152);
  group.add(body, led);
  return { group, display };
}

function screenAnchor(mesh, [width, height]) {
  const center = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  mesh.getWorldPosition(center);
  mesh.getWorldQuaternion(quaternion);
  const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(quaternion);
  return { center: center.toArray(), normal: normal.toArray(), width, height };
}

function pointAnchor(object, offset = [0, 0, 0]) {
  const v = new THREE.Vector3();
  object.getWorldPosition(v);
  return v.add(new THREE.Vector3(...offset)).toArray();
}

/** Loads the G7, MacBook and DualSense models, keyed by the object they become. */
export async function loadDeskModels() {
  const loader = new GLTFLoader();
  const entries = await Promise.all(
    Object.entries(MODEL_URLS).map(async ([key, url]) => [key, (await loader.loadAsync(url)).scene]),
  );
  return Object.fromEntries(entries);
}

/** Builds the desk scene into a canvas. Returns controls driven by scroll. */
export function createDeskScene(canvas, { coverSrcs = [], cssHost, screenElements, models }) {
  RectAreaLightUniformsLib.init();
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#07080a");
  scene.fog = new THREE.Fog("#07080a", 3.2, 7);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.12;

  const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 20);
  const shadowTex = shadowTexture();

  buildRoom(scene);
  const frame = buildFrame(shadowTex);
  scene.add(frame.base);

  const top = new THREE.Group();
  top.position.y = SIT_HEIGHT;
  scene.add(top);
  top.add(frame.inner);
  const deskTop = box(DESK.width, DESK.thickness, DESK.depth, mat.deskTop, 0.006);
  deskTop.position.y = -DESK.thickness / 2;
  top.add(deskTop);

  const monitor = buildMonitor(models.monitor, shadowTex);
  monitor.group.position.set(0.34, 0, -0.16);
  monitor.group.rotation.y = -0.12;
  const laptop = buildLaptop(models.laptop, shadowTex);
  laptop.group.position.set(-0.4, 0, -0.04);
  laptop.group.rotation.y = 0.1;
  const phone = buildPhone(shadowTex);
  phone.group.position.set(-0.03, 0, 0.16);
  phone.group.rotation.y = 0.08;
  const controller = buildController(models.controller, shadowTex);
  controller.position.set(0.36, 0, 0.21);
  controller.rotation.y = -0.4;
  const guides = buildGuides(shadowTex, coverSrcs);
  guides.position.set(-0.6, 0, 0.25);
  guides.rotation.y = 0.18;
  const keypad = buildKeypad();
  keypad.group.position.set(0.6, -0.022, DESK.depth / 2 + 0.008);
  top.add(monitor.group, laptop.group, phone.group, controller, guides, keypad.group);

  const biasLight = new THREE.RectAreaLight(ACCENT, 7, 0.6, 0.3);
  biasLight.position.set(0, 0.3, -0.09);
  monitor.group.add(biasLight);
  const monitorLight = new THREE.RectAreaLight("#dfe7ff", 8, 0.68, 0.39);
  monitorLight.position.set(0, 0.3, 0.075);
  monitorLight.rotation.y = Math.PI;
  monitor.group.add(monitorLight);
  const laptopLight = new THREE.RectAreaLight("#e6ecff", 6, 0.345, 0.223);
  laptop.screen.add(laptopLight);
  laptopLight.position.set(0, 0, 0.004);
  laptopLight.rotation.y = Math.PI;
  const phoneLight = new THREE.RectAreaLight(ACCENT, 0, 0.07, 0.15);
  phone.screen.add(phoneLight);
  phoneLight.position.set(0, 0, 0.003);
  phoneLight.rotation.y = Math.PI;
  scene.add(new THREE.HemisphereLight("#8fa3c4", "#0a0a0c", 0.12));
  const fill = new THREE.DirectionalLight("#9fb4d9", 0.08);
  fill.position.set(-2, 3, 2.5);
  scene.add(fill);

  top.updateMatrixWorld(true);
  const anchors = {
    monitor: screenAnchor(monitor.screen, monitor.size),
    laptop: screenAnchor(laptop.screen, laptop.size),
    phone: screenAnchor(phone.screen, [0.07, 0.15]),
    guides: pointAnchor(guides, [0, 0.01, 0]),
    controller: pointAnchor(controller, [0, 0.025, 0]),
    desk: [0, SIT_HEIGHT, 0],
  };

  const cssRenderer = new CSS3DRenderer();
  cssHost.appendChild(cssRenderer.domElement);
  const cssScene = new THREE.Scene();
  const domScreens = [
    { mesh: monitor.screen, size: monitor.size, element: screenElements.monitor },
    { mesh: laptop.screen, size: laptop.size, element: screenElements.laptop },
  ].map(({ mesh, size, element }) => {
    const object = new CSS3DObject(element);
    cssScene.add(object);
    return { mesh, object, size, element };
  });
  const tmpScale = new THREE.Vector3();

  function syncDomScreens() {
    domScreens.forEach(({ mesh, object, size, element }) => {
      mesh.matrixWorld.decompose(object.position, object.quaternion, tmpScale);
      object.scale.setScalar(size[0] / Number(element.dataset.width));
    });
  }

  const pickable = { work: monitor.group, tools: laptop.group, guides, side: controller, contact: phone.group };
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  /** Section key of the object under a viewport point, or null. */
  function pick(clientX, clientY, width, height) {
    pointer.set((clientX / width) * 2 - 1, -(clientY / height) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(Object.values(pickable), true)[0];
    if (!hit) return null;
    return Object.keys(pickable).find((key) => {
      let node = hit.object;
      while (node) {
        if (node === pickable[key]) return true;
        node = node.parent;
      }
      return false;
    });
  }

  function setPose({ position, target }) {
    camera.position.set(...position);
    camera.lookAt(...target);
  }

  function setRise(t) {
    const height = SIT_HEIGHT + (STAND_HEIGHT - SIT_HEIGHT) * t;
    top.position.y = height;
    keypad.display.set(height * 100);
  }

  function setPhoneLit(t) {
    phone.screenMaterial.color.setScalar(t);
    phoneLight.intensity = 6 * t;
  }

  function resize(width, height) {
    renderer.setSize(width, height, false);
    cssRenderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function render() {
    renderer.render(scene, camera);
    syncDomScreens();
    cssRenderer.render(cssScene, camera);
  }

  function dispose() {
    scene.traverse((object) => {
      if (!object.isMesh) return;
      object.geometry.dispose();
      [object.material].flat().forEach((m) => {
        m.map?.dispose();
        m.dispose();
      });
    });
    scene.environment?.dispose();
    pmrem.dispose();
    renderer.dispose();
    cssRenderer.domElement.remove();
  }

  setRise(0);
  setPhoneLit(0);
  return { anchors, camera, pick, setPose, setRise, setPhoneLit, resize, render, dispose, fov: camera.fov };
}
