import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";

import { keypadDisplay, phoneScreen, shadowTexture, SCREEN_COLOR } from "./screens";

const SIT_HEIGHT = 0.74;
const STAND_HEIGHT = 1.12;
const DESK = { width: 1.6, depth: 0.75, thickness: 0.035 };
const ACCENT = new THREE.Color("#3d7fff");

const mat = {
  deskTop: new THREE.MeshStandardMaterial({ color: "#131315", roughness: 0.62, dithering: true }),
  frame: new THREE.MeshStandardMaterial({ color: "#1b1b1e", roughness: 0.42, metalness: 0.6 }),
  wall: new THREE.MeshStandardMaterial({ color: "#b9bcbf", roughness: 0.95, dithering: true }),
  floor: new THREE.MeshStandardMaterial({ color: "#1d1c1b", roughness: 0.9, dithering: true }),
  aluminium: new THREE.MeshStandardMaterial({ color: "#5e6166", roughness: 0.34, metalness: 0.9 }),
  blackPlastic: new THREE.MeshStandardMaterial({ color: "#0e0e10", roughness: 0.5 }),
  switchPlate: new THREE.MeshStandardMaterial({ color: "#e4e1d8", roughness: 0.7 }),
  controllerBlue: new THREE.MeshStandardMaterial({ color: "#2f6fe0", roughness: 0.45 }),
  controllerBlack: new THREE.MeshStandardMaterial({ color: "#121318", roughness: 0.55 }),
  bookEdge: new THREE.MeshStandardMaterial({ color: "#ece9e2", roughness: 0.9 }),
  faceButton: new THREE.MeshStandardMaterial({ color: "#2a2d36", roughness: 0.3 }),
  lightBar: new THREE.MeshBasicMaterial({ color: "#7fb2ff", toneMapped: false }),
};

function box(w, h, d, material, radius = 0.004) {
  const mesh = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, Math.min(radius, w / 2, h / 2, d / 2)), material);
  return mesh;
}

function screenPlane(w, h, texture) {
  const material = new THREE.MeshBasicMaterial({ map: texture ?? null, color: texture ? "#ffffff" : SCREEN_COLOR, toneMapped: false });
  return new THREE.Mesh(new THREE.PlaneGeometry(w, h), material);
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

function buildMonitor(shadowTex) {
  const group = new THREE.Group();
  const foot = box(0.26, 0.012, 0.19, mat.blackPlastic, 0.005);
  foot.position.set(0, 0.006, -0.02);
  const neck = box(0.05, 0.3, 0.03, mat.blackPlastic, 0.008);
  neck.position.set(0, 0.16, -0.08);
  const panel = box(0.734, 0.424, 0.028, mat.blackPlastic, 0.006);
  panel.position.set(0, 0.34, -0.055);
  const screen = screenPlane(0.71, 0.4);
  screen.position.set(0, 0.34, -0.0405);
  group.add(foot, neck, panel, screen, contactShadow(shadowTex, 0.42, 0.3));
  return { group, screen, size: [0.71, 0.4] };
}

function buildLaptop(shadowTex) {
  const group = new THREE.Group();
  const stand = new THREE.Group();
  [-0.13, 0.13].forEach((x) => {
    const rail = box(0.018, 0.012, 0.26, mat.aluminium, 0.004);
    rail.position.set(x, 0.035, 0);
    rail.rotation.x = 0.16;
    const post = box(0.018, 0.07, 0.018, mat.aluminium, 0.004);
    post.position.set(x, 0.035, -0.11);
    stand.add(rail, post);
  });
  const body = new THREE.Group();
  body.position.set(0, 0.06, 0);
  body.rotation.x = 0.16;
  const base = box(0.356, 0.016, 0.248, mat.aluminium, 0.006);
  const keyboard = box(0.29, 0.002, 0.11, mat.blackPlastic, 0.001);
  keyboard.position.set(0, 0.0085, -0.02);
  const hinge = new THREE.Group();
  hinge.position.set(0, 0.008, -0.124);
  hinge.rotation.x = -0.26;
  const lid = box(0.356, 0.24, 0.008, mat.aluminium, 0.006);
  lid.position.set(0, 0.12, 0);
  const bezel = box(0.348, 0.232, 0.002, mat.blackPlastic, 0.004);
  bezel.position.set(0, 0.12, 0.004);
  const screen = screenPlane(0.33, 0.212);
  screen.position.set(0, 0.122, 0.0055);
  hinge.add(lid, bezel, screen);
  body.add(base, keyboard, hinge);
  group.add(stand, body, contactShadow(shadowTex, 0.46, 0.36, 0.6));
  return { group, screen, size: [0.33, 0.212] };
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

function buildController(shadowTex) {
  const group = new THREE.Group();
  const shell = box(0.124, 0.026, 0.058, mat.controllerBlue, 0.012);
  shell.position.set(0, 0.03, 0);
  const plate = box(0.07, 0.006, 0.046, mat.controllerBlack, 0.005);
  plate.position.set(0, 0.043, 0.004);
  const pad = box(0.046, 0.003, 0.026, mat.controllerBlack, 0.003);
  pad.position.set(0, 0.0445, -0.012);
  group.add(shell, plate, pad);
  [-1, 1].forEach((side) => {
    const grip = new THREE.Mesh(new THREE.CapsuleGeometry(0.0155, 0.04, 6, 18), mat.controllerBlue);
    grip.position.set(side * 0.046, 0.022, 0.034);
    grip.rotation.set(Math.PI / 2 + 0.45, 0, side * 0.28);
    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.0085, 0.0085, 0.01, 20), mat.controllerBlack);
    stick.position.set(side * 0.02, 0.05, 0.018);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.0075, 0.0075, 0.002, 20), mat.controllerBlue);
    cap.position.set(side * 0.02, 0.0565, 0.018);
    group.add(grip, stick, cap);
  });
  [[0, -0.008], [0, 0.008], [-0.008, 0], [0.008, 0]].forEach(([dx, dz]) => {
    const face = new THREE.Mesh(new THREE.CylinderGeometry(0.0034, 0.0034, 0.003, 14), mat.faceButton);
    face.position.set(0.042 + dx, 0.0445, -0.004 + dz);
    const dpad = box(0.006, 0.003, 0.006, mat.controllerBlack, 0.0012);
    dpad.position.set(-0.042 + dx * 0.95, 0.0445, -0.004 + dz * 0.95);
    group.add(face, dpad);
  });
  const lightBar = box(0.05, 0.0015, 0.004, mat.lightBar, 0.0007);
  lightBar.position.set(0, 0.0453, -0.026);
  group.add(lightBar);
  group.add(contactShadow(shadowTex, 0.2, 0.16, 0.65));
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

/** Builds the desk scene into a canvas. Returns controls driven by scroll. */
export function createDeskScene(canvas, { coverSrcs = [] } = {}) {
  RectAreaLightUniformsLib.init();
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
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

  const monitor = buildMonitor(shadowTex);
  monitor.group.position.set(0.34, 0, -0.16);
  monitor.group.rotation.y = -0.12;
  const laptop = buildLaptop(shadowTex);
  laptop.group.position.set(-0.4, 0, -0.04);
  laptop.group.rotation.y = 0.1;
  const phone = buildPhone(shadowTex);
  phone.group.position.set(-0.03, 0, 0.16);
  phone.group.rotation.y = 0.08;
  const controller = buildController(shadowTex);
  controller.position.set(0.36, 0, 0.21);
  controller.rotation.y = -0.4;
  const guides = buildGuides(shadowTex, coverSrcs);
  guides.position.set(-0.6, 0, 0.25);
  guides.rotation.y = 0.18;
  const keypad = buildKeypad();
  keypad.group.position.set(0.6, -0.022, DESK.depth / 2 + 0.008);
  top.add(monitor.group, laptop.group, phone.group, controller, guides, keypad.group);

  const biasLight = new THREE.RectAreaLight(ACCENT, 7, 0.6, 0.3);
  biasLight.position.set(0, 0.34, -0.075);
  monitor.group.add(biasLight);
  const monitorLight = new THREE.RectAreaLight("#dfe7ff", 8, 0.7, 0.4);
  monitorLight.position.set(0, 0.34, -0.035);
  monitorLight.rotation.y = Math.PI;
  monitor.group.add(monitorLight);
  const laptopLight = new THREE.RectAreaLight("#e6ecff", 6, 0.33, 0.21);
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

  function setScreens({ work, tools }) {
    if (work) {
      monitor.screen.material.map = work;
      monitor.screen.material.color.set("#ffffff");
      monitor.screen.material.needsUpdate = true;
    }
    if (tools) {
      laptop.screen.material.map = tools;
      laptop.screen.material.color.set("#ffffff");
      laptop.screen.material.needsUpdate = true;
    }
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
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function render() {
    renderer.render(scene, camera);
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
  }

  setRise(0);
  setPhoneLit(0);
  return { anchors, camera, setScreens, setPose, setRise, setPhoneLit, resize, render, dispose, fov: camera.fov };
}
