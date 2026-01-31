import { createCamera } from "./camera";
import { createGraph } from "./graph";
import { createInputState, setupInput } from "./input";
import { render, buildFocusSet } from "./render";

const canvas = document.getElementById("world") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

const camera = createCamera();
const graph = createGraph();
const input = createInputState();
const alphas = new Map<string, number>();

for (const node of graph.nodes) {
  alphas.set(node.id, 1);
}

function resize() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);
  scheduleRender();
}

let animating = false;

function scheduleRender() {
  if (animating) return;
  animating = true;
  requestAnimationFrame(tick);
}

function tick() {
  const settled = updateAlphas();
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  render(ctx, canvas, graph, camera, input.hovered, alphas);
  if (!settled) {
    requestAnimationFrame(tick);
  } else {
    animating = false;
  }
}

function updateAlphas(): boolean {
  const focused = buildFocusSet(graph, input.hovered);
  let settled = true;
  const rate = 0.15;
  for (const node of graph.nodes) {
    const target = !input.hovered || focused.has(node.id) ? 1.0 : 0.15;
    const current = alphas.get(node.id) ?? 1.0;
    if (Math.abs(current - target) < 0.01) {
      alphas.set(node.id, target);
    } else {
      alphas.set(node.id, current + (target - current) * rate);
      settled = false;
    }
  }
  return settled;
}

setupInput(canvas, camera, graph, input, scheduleRender);
window.addEventListener("resize", resize);
resize();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").catch(() => {});
}
