/** Node in the world graph. */
export interface Node {
  id: string;
  label: string;
  description: string;
  url?: string;
  tier: "ecosystem" | "project" | "detail";
  /** Parent ecosystem id, if any. */
  parent?: string;
  /** Base position — layout shifts these based on focus. */
  x: number;
  y: number;
  /** Visual radius at native zoom. */
  radius: number;
  color: string;
}

/** Edge connecting two nodes. */
export interface Edge {
  from: string;
  to: string;
  /** Relationship label. */
  label?: string;
}

export interface Graph {
  nodes: Node[];
  edges: Edge[];
}

export function createGraph(): Graph {
  const nodes: Node[] = [
    // Ecosystems
    {
      id: "rhi",
      label: "rhi",
      description: "Glue layer for computers",
      url: "https://docs.rhi.zone",
      tier: "ecosystem",
      x: -200,
      y: 0,
      radius: 120,
      color: "#4a7c59",
    },
    {
      id: "exo",
      label: "exo",
      description: "Places to exist",
      url: "https://docs.exo.place",
      tier: "ecosystem",
      x: 200,
      y: 0,
      radius: 100,
      color: "#7c4a6e",
    },

    // rhi projects
    {
      id: "normalize",
      label: "normalize",
      description: "Structural code intelligence across 98 languages",
      url: "https://docs.rhi.zone/normalize",
      tier: "project",
      parent: "rhi",
      x: -320,
      y: -100,
      radius: 30,
      color: "#5a9c6a",
    },
    {
      id: "unshape",
      label: "unshape",
      description: "Constructive media generation",
      url: "https://docs.rhi.zone/unshape",
      tier: "project",
      parent: "rhi",
      x: -280,
      y: 80,
      radius: 28,
      color: "#5a9c6a",
    },
    {
      id: "dew",
      label: "dew",
      description: "Minimal expression language",
      url: "https://docs.rhi.zone/dew",
      tier: "project",
      parent: "rhi",
      x: -180,
      y: 110,
      radius: 22,
      color: "#5a9c6a",
    },
    {
      id: "moonlet",
      label: "moonlet",
      description: "Lua runtime with plugin system",
      url: "https://docs.rhi.zone/moonlet",
      tier: "project",
      parent: "rhi",
      x: -120,
      y: -80,
      radius: 26,
      color: "#5a9c6a",
    },
    {
      id: "paraphase",
      label: "paraphase",
      description: "Pipeline orchestrator for data conversion",
      url: "https://docs.rhi.zone/paraphase",
      tier: "project",
      parent: "rhi",
      x: -340,
      y: 10,
      radius: 24,
      color: "#5a9c6a",
    },
    {
      id: "dusklight",
      label: "dusklight",
      description: "Universal UI client with control plane",
      url: "https://docs.rhi.zone/dusklight",
      tier: "project",
      parent: "rhi",
      x: -150,
      y: 60,
      radius: 25,
      color: "#5a9c6a",
    },
    {
      id: "server-less",
      label: "server-less",
      description: "One impl → many protocols",
      url: "https://docs.rhi.zone/server-less",
      tier: "project",
      parent: "rhi",
      x: -240,
      y: -60,
      radius: 23,
      color: "#5a9c6a",
    },
    {
      id: "concord",
      label: "concord",
      description: "API bindings IR and codegen",
      url: "https://docs.rhi.zone/concord",
      tier: "project",
      parent: "rhi",
      x: -100,
      y: 20,
      radius: 22,
      color: "#5a9c6a",
    },
    {
      id: "rescribe",
      label: "rescribe",
      description: "Lossless document conversion",
      url: "https://docs.rhi.zone/rescribe",
      tier: "project",
      parent: "rhi",
      x: -300,
      y: -40,
      radius: 22,
      color: "#5a9c6a",
    },
    {
      id: "playmate",
      label: "playmate",
      description: "Game design primitives",
      url: "https://docs.rhi.zone/playmate",
      tier: "project",
      parent: "rhi",
      x: -200,
      y: -90,
      radius: 24,
      color: "#5a9c6a",
    },
    {
      id: "interconnect",
      label: "interconnect",
      description: "Federation protocol for persistent worlds",
      url: "https://docs.rhi.zone/interconnect",
      tier: "project",
      parent: "rhi",
      x: -140,
      y: -40,
      radius: 23,
      color: "#5a9c6a",
    },
    {
      id: "reincarnate",
      label: "reincarnate",
      description: "Legacy software lifting",
      url: "https://docs.rhi.zone/reincarnate",
      tier: "project",
      parent: "rhi",
      x: -260,
      y: 40,
      radius: 22,
      color: "#5a9c6a",
    },
    {
      id: "myenv",
      label: "myenv",
      description: "Ecosystem orchestrator",
      url: "https://docs.rhi.zone/myenv",
      tier: "project",
      parent: "rhi",
      x: -180,
      y: -50,
      radius: 20,
      color: "#5a9c6a",
    },
    {
      id: "portals",
      label: "portals",
      description: "Standard library interfaces",
      url: "https://docs.rhi.zone/portals",
      tier: "project",
      parent: "rhi",
      x: -220,
      y: 60,
      radius: 20,
      color: "#5a9c6a",
    },
    {
      id: "zone",
      label: "zone",
      description: "Lua-based tools and orchestration",
      url: "https://docs.rhi.zone/zone",
      tier: "project",
      parent: "rhi",
      x: -160,
      y: 90,
      radius: 20,
      color: "#5a9c6a",
    },

    // exo projects
    {
      id: "hologram",
      label: "hologram",
      description: "Discord bot — entities with text-based definitions",
      url: "https://docs.exo.place/hologram",
      tier: "project",
      parent: "exo",
      x: 160,
      y: -50,
      radius: 30,
      color: "#9c5a8a",
    },
    {
      id: "aspect",
      label: "aspect",
      description: "Card-based identity exploration sandbox",
      url: "https://docs.exo.place/aspect",
      tier: "project",
      parent: "exo",
      x: 240,
      y: 60,
      radius: 28,
      color: "#9c5a8a",
    },

    // Standalone projects
    {
      id: "claude-code-hub",
      label: "claude-code-hub",
      description: "Orchestration hub for Claude Code agents",
      url: "https://github.com/pterror/claude-code-hub",
      tier: "project",
      x: 0,
      y: -160,
      radius: 26,
      color: "#7c7c4a",
    },
    {
      id: "ooxml",
      label: "ooxml",
      description: "Office Open XML library for Rust",
      url: "https://pterror.github.io/ooxml",
      tier: "project",
      x: 0,
      y: 160,
      radius: 24,
      color: "#7c7c4a",
    },
  ];

  const edges: Edge[] = [
    // Ecosystem containment
    { from: "rhi", to: "normalize" },
    { from: "rhi", to: "unshape" },
    { from: "rhi", to: "dew" },
    { from: "rhi", to: "moonlet" },
    { from: "rhi", to: "paraphase" },
    { from: "rhi", to: "dusklight" },
    { from: "rhi", to: "server-less" },
    { from: "rhi", to: "concord" },
    { from: "rhi", to: "rescribe" },
    { from: "rhi", to: "playmate" },
    { from: "rhi", to: "interconnect" },
    { from: "rhi", to: "reincarnate" },
    { from: "rhi", to: "myenv" },
    { from: "rhi", to: "portals" },
    { from: "rhi", to: "zone" },
    { from: "exo", to: "hologram" },
    { from: "exo", to: "aspect" },

    // Internal dependencies
    { from: "unshape", to: "dew", label: "uses" },
    { from: "moonlet", to: "normalize", label: "plugin" },
    { from: "moonlet", to: "portals", label: "capabilities" },

  ];

  return { nodes, edges };
}
