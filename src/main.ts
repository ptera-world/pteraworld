import { createCamera } from "./camera";
import { createGraph } from "./graph";
import { buildWorld, updateTransform, setFilterRef, setFocus, animateTo, updatePositions } from "./dom";
import { setupInput } from "./input";
import { initPanel, openPanel } from "./panel";
import { showCard, hideCard } from "./card";
import { createFilter, buildFilterUI, applyFilter, getVisibleIds } from "./filter";
import { runLayout, resetLayout } from "./layout";

const camera = createCamera();
const graph = createGraph();

buildWorld(graph);

const filter = createFilter(graph.nodes);
setFilterRef(filter);
applyFilter(filter, graph);
buildFilterUI(document.getElementById("filter-bar")!, filter, () => {
  applyFilter(filter, graph);
  if (filter.active.size > 0) {
    const vis = getVisibleIds(filter, graph);
    runLayout(graph, vis);
    updatePositions(graph);

    // Fit camera to visible non-ecosystem nodes
    const vp = document.getElementById("viewport")!;
    const visible = graph.nodes.filter(
      (n) => vis.has(n.id) && n.tier !== "ecosystem",
    );
    if (visible.length > 0) {
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      for (const n of visible) {
        minX = Math.min(minX, n.x);
        maxX = Math.max(maxX, n.x);
        minY = Math.min(minY, n.y);
        maxY = Math.max(maxY, n.y);
      }
      const cx = (minX + maxX) / 2;
      const cy = (minY + maxY) / 2;
      const pad = 200;
      const zoomX = vp.clientWidth / (maxX - minX + pad);
      const zoomY = vp.clientHeight / (maxY - minY + pad);
      const zoom = Math.min(Math.max(Math.min(zoomX, zoomY), 1.5), 3.5);
      animateTo(camera, cx, cy, zoom);
    }
  } else {
    resetLayout(graph);
    updatePositions(graph);
    animateTo(camera, 0, 0, 1.5);
  }
  hideCard();
});

updateTransform(camera);
setupInput(document.getElementById("viewport")!, camera, graph);
initPanel(camera, graph);

// Handle ?focus= query param
const focusId = new URLSearchParams(location.search).get("focus");
if (focusId) {
  const node = graph.nodes.find((n) => n.id === focusId);
  if (node) {
    setFocus(graph, node);
    animateTo(camera, node.x, node.y, 3);
    showCard(node, graph);
  }
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").catch(() => {});
}
