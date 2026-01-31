import type { Graph, Node } from "./graph";

export function showCard(node: Node, graph: Graph): void {
  const el = document.getElementById("card");
  if (!el) return;
  el.innerHTML = renderCard(node, graph);
  el.hidden = false;
  el.querySelector(".card-close")?.addEventListener("click", hideCard);
}

export function hideCard(): void {
  const el = document.getElementById("card");
  if (!el) return;
  el.hidden = true;
  el.innerHTML = "";
}

export function isCardOpen(): boolean {
  const el = document.getElementById("card");
  return el ? !el.hidden : false;
}

function renderCard(node: Node, graph: Graph): string {
  const refs = graph.edges
    .filter(e => e.label && (e.from === node.id || e.to === node.id))
    .map(e => {
      const otherId = e.from === node.id ? e.to : e.from;
      const other = graph.nodes.find(n => n.id === otherId);
      if (!other) return "";
      const dir = e.from === node.id ? "\u2192" : "\u2190";
      return `<div class="card-ref">${dir} <strong>${other.label}</strong> <span class="card-ref-label">${e.label}</span></div>`;
    })
    .filter(Boolean)
    .join("");

  const url = node.url
    ? `<a class="card-link" href="${node.url}" target="_blank" rel="noopener">${node.url}</a>`
    : "";

  return `
    <div class="card-header">
      <h2 class="card-title">${node.label}</h2>
      <button class="card-close" aria-label="Close">&times;</button>
    </div>
    <p class="card-desc">${node.description}</p>
    ${url}
    ${refs ? `<div class="card-refs">${refs}</div>` : ""}
  `;
}
