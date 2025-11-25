export interface Node {
  id: string;
  x: number;
  y: number;

  _pointerDown?: {
    x: number;
    y: number;
    t: number;
  } | null;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
}

export interface Graph {
  nodes: Node[];
  edges: Edge[];
}
