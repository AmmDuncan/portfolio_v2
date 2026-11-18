import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

/** The desk's models keyed by the object they become; `bytes` is the file size, used for load progress. */
const MODELS = {
  monitor: { url: "/models/g7.glb", bytes: 24084 },
  laptop: { url: "/models/macbook.glb", bytes: 106700 },
  controller: { url: "/models/dualsense.glb", bytes: 577388 },
  phone: { url: "/models/iphone.glb", bytes: 57896 },
  console: { url: "/models/ps5slim.glb", bytes: 76032 },
};

/** Loads every desk model in parallel and reports combined progress (0..1). Resolves to { [key]: scene }. */
export async function loadDeskModels(onProgress = () => {}) {
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  const loaded = Object.fromEntries(Object.keys(MODELS).map((key) => [key, 0]));
  const totalBytes = Object.values(MODELS).reduce((sum, { bytes }) => sum + bytes, 0);
  const report = (key, fraction) => {
    loaded[key] = Math.min(fraction, 1) * MODELS[key].bytes;
    onProgress(Object.values(loaded).reduce((sum, bytes) => sum + bytes, 0) / totalBytes);
  };
  const entries = await Promise.all(
    Object.entries(MODELS).map(async ([key, { url, bytes }]) => {
      const gltf = await loader.loadAsync(url, (event) =>
        report(key, Math.min(event.loaded / (event.total || bytes), 0.98)),
      );
      report(key, 1);
      return [key, gltf.scene];
    }),
  );
  return Object.fromEntries(entries);
}
