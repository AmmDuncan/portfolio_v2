import * as THREE from "three";
import { HorizontalBlurShader } from "three/examples/jsm/shaders/HorizontalBlurShader.js";
import { VerticalBlurShader } from "three/examples/jsm/shaders/VerticalBlurShader.js";

/**
 * Bakes soft contact shadows for everything resting on a surface: renders the objects from just
 * under the surface looking up (closer = darker), blurs it, and lays it on a plane.
 * Returns the plane (add it at the surface) and a bake(renderer, scene) to run once objects are placed.
 */
export function createContactShadows({ width, depth, height = 0.3, resolution = 1024, blur = 2.5, darkness = 1.4, opacity = 0.9 }) {
  const group = new THREE.Group();
  const size = [resolution, Math.round((resolution * depth) / width)];
  const target = new THREE.WebGLRenderTarget(...size);
  const targetBlur = new THREE.WebGLRenderTarget(...size);
  target.texture.generateMipmaps = false;
  targetBlur.texture.generateMipmaps = false;

  const geometry = new THREE.PlaneGeometry(width, depth).rotateX(Math.PI / 2);
  const plane = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ map: target.texture, opacity, transparent: true, depthWrite: false }),
  );
  plane.renderOrder = 1;
  plane.scale.y = -1;
  plane.position.y = 0.0008;
  const blurPlane = new THREE.Mesh(geometry);
  blurPlane.visible = false;

  const camera = new THREE.OrthographicCamera(-width / 2, width / 2, depth / 2, -depth / 2, 0, height);
  camera.rotation.x = Math.PI / 2;
  group.add(plane, blurPlane, camera);

  const depthMaterial = new THREE.MeshDepthMaterial();
  depthMaterial.userData.darkness = { value: darkness };
  depthMaterial.onBeforeCompile = (shader) => {
    shader.uniforms.darkness = depthMaterial.userData.darkness;
    shader.fragmentShader = `uniform float darkness;\n${shader.fragmentShader.replace(
      "gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );",
      "gl_FragColor = vec4( vec3( 0.0 ), ( 1.0 - fragCoordZ ) * darkness );",
    )}`;
  };
  depthMaterial.depthTest = false;
  depthMaterial.depthWrite = false;

  const horizontal = new THREE.ShaderMaterial(HorizontalBlurShader);
  const vertical = new THREE.ShaderMaterial(VerticalBlurShader);
  horizontal.depthTest = false;
  vertical.depthTest = false;

  function blurPass(renderer, amount) {
    blurPlane.visible = true;
    blurPlane.material = horizontal;
    horizontal.uniforms.tDiffuse.value = target.texture;
    horizontal.uniforms.h.value = amount / 256;
    renderer.setRenderTarget(targetBlur);
    renderer.render(blurPlane, camera);
    blurPlane.material = vertical;
    vertical.uniforms.tDiffuse.value = targetBlur.texture;
    vertical.uniforms.v.value = amount / 256;
    renderer.setRenderTarget(target);
    renderer.render(blurPlane, camera);
    blurPlane.visible = false;
  }

  function bake(renderer, scene) {
    const background = scene.background;
    const clearAlpha = renderer.getClearAlpha();
    scene.background = null;
    plane.visible = false;
    scene.updateMatrixWorld(true);
    scene.overrideMaterial = depthMaterial;
    renderer.setClearAlpha(0);
    renderer.setRenderTarget(target);
    renderer.clear();
    renderer.render(scene, camera);
    scene.overrideMaterial = null;
    blurPass(renderer, blur);
    blurPass(renderer, blur * 0.4);
    renderer.setRenderTarget(null);
    renderer.setClearAlpha(clearAlpha);
    scene.background = background;
    plane.visible = true;
  }

  function dispose() {
    target.dispose();
    targetBlur.dispose();
    depthMaterial.dispose();
    horizontal.dispose();
    vertical.dispose();
  }

  return { group, bake, dispose };
}
