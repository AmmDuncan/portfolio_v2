import { HOVER_LABEL } from "../deskContent";

const UI = "a, button, nav, .panel";

/** Hover tag and click-to-fly for the objects on the desk. */
export function createPointerPicking({ scene, hoverTag, getActive, isBusy, onPick }) {
  const pointer = { x: 0, y: 0, moved: false, mouse: false };
  const pick = (x, y) => scene.pick(x, y, window.innerWidth, window.innerHeight);

  function updateHover() {
    const overUi = document.elementFromPoint(pointer.x, pointer.y)?.closest(UI);
    const key = overUi ? null : pick(pointer.x, pointer.y);
    const target = key && key !== getActive() ? key : null;
    document.body.style.cursor = target ? "pointer" : "";
    hoverTag.hidden = !target;
    if (!target) return;
    hoverTag.textContent = `${HOVER_LABEL[target]} →`;
    hoverTag.style.transform = `translate(${pointer.x + 16}px, ${pointer.y + 16}px)`;
  }

  function onPointerMove(event) {
    pointer.mouse = event.pointerType === "mouse";
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.moved = true;
  }

  function onClick(event) {
    if (event.target.closest(UI)) return;
    const key = pick(event.clientX, event.clientY);
    if (key && key !== getActive()) onPick(key);
  }

  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("click", onClick);

  return {
    /** Call once per animation frame; `rendered` says the scene moved under the pointer. */
    onFrame(rendered) {
      if (rendered) pointer.moved = true;
      if (!pointer.moved || !pointer.mouse || isBusy()) return;
      updateHover();
      pointer.moved = false;
    },
    hide() {
      hoverTag.hidden = true;
    },
    dispose() {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("click", onClick);
      document.body.style.cursor = "";
    },
  };
}
