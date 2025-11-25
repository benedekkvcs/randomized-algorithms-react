import type { Graph, Node, Edge } from "../components/GraphViewer/types";

export interface KargerStep {
  graph: Graph;
  description: string;
  mergedNodes?: [string, string]; // mely két csúcs lett összevonva
  removedEdges?: string[];        // törölt hurokélek ID-i
  selectedEdgeId?: string;
  mergePair?: { u: string; v: string };
}

export function generateRandomGraph(nodeCount: number) : Node[] {
  const nodes: Node[] = [];

  const radius = 220;
  const centerX = 400;
  const centerY = 250;

  for (let i = 1; i <= nodeCount; i++) {
    const angle = (2 * Math.PI * i) / nodeCount;
    nodes.push({
      id: i.toString(),
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    });
  }

  return nodes;
}

export function runKargerSteps(initial: Graph): KargerStep[] {
  // A lépések listája
  const steps: KargerStep[] = [];

  // Munka-másolat (mély másolat)
  let graph: Graph = {
    nodes: initial.nodes.map((n) => ({ ...n })),
    edges: initial.edges.map((e) => ({ ...e })),
  };

  steps.push({
    graph: structuredClone(graph),
    description: "Kezdeti gráf",
  });

  // Amíg több mint 2 csúcs van, folytatjuk az összehúzást
  while (graph.nodes.length > 2 && graph.edges.length > 0) {
    // 1. Válassz véletlen élt
    const randomEdge = graph.edges[Math.floor(Math.random() * graph.edges.length)];
    const u = randomEdge.source;
    const v = randomEdge.target;

    steps.push({
      graph: structuredClone(graph),
      description: `Véletlen él kiválasztva: ${u} — ${v}`,
      mergedNodes: [u, v],
      selectedEdgeId: randomEdge.id,
      mergePair: { u, v } 
    });

    // 2. Összevonás: u és v → új csúcs: "u_v"
    const newNodeId = `${u}_${v}`;
    const uNode = graph.nodes.find(n => n.id === u)!;
    const vNode = graph.nodes.find(n => n.id === v)!;

    const newNode = {
      id: newNodeId,
      label: newNodeId,
      x: (uNode.x + vNode.x) / 2,    // 👈 KÖZÉPPONT
      y: (uNode.y + vNode.y) / 2,
    };

    // távolítsuk el a régi csúcsokat
    graph.nodes = graph.nodes.filter((n) => n.id !== u && n.id !== v);
    graph.nodes.push(newNode);

    // 3. Az éleket frissíteni kell:
    // u vagy v helyett newNodeId lesz a source/target
    graph.edges = graph.edges.map((e) => {
      let source = e.source;
      let target = e.target;

      if (source === u || source === v) source = newNodeId;
      if (target === u || target === v) target = newNodeId;

      return {
        id: e.id,
        source,
        target,
      };
    });

    // 4. Hurokélek törlése
    const before = graph.edges.length;
    graph.edges = graph.edges.filter((e) => e.source !== e.target);
    const deleted = before - graph.edges.length;

    if (deleted > 0) {
/*       steps.push({
        graph: structuredClone(graph),
        description: `${deleted} hurokélt töröltünk`,
      }); */
    }

    // 5. Állapot elmentése
    steps.push({
      graph: structuredClone(graph),
      description: `Csúcsok összevonva: ${u} + ${v} → ${newNodeId}`,
      mergedNodes: [u, v],
    });
  } 

  // Végső állapot
  steps.push({
    graph: structuredClone(graph),
    description: `Kész: végső 2 csúcs maradt`,
  }); 

  return steps;
}


