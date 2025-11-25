import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { Graph, Edge, Node } from "./types";

interface GraphCanvasProps {
  graph: Graph;
  selectedEdgeId?: string;
  mergePair?: { u: string; v: string };
  onNodePositionChange?: (id: string, x: number, y: number) => void;
  onNodeClick?: (nodeId: string) => void;
}

type CurvedEdge = Edge & {
  parallelIndex: number;
  parallelCount: number;
};

const width = 800;
const height = 500;

const GraphCanvas: React.FC<GraphCanvasProps> = ({ graph, selectedEdgeId, mergePair, onNodePositionChange, onNodeClick }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    let rafId: number | null = null;

    svg.selectAll("*").remove();

    const edgeLayer = svg.append("g").attr("class", "edges");
    const nodeLayer = svg.append("g").attr("class", "nodes");

    if (graph.nodes.length === 0) {
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .attr("fill", "#9ca3af")
        .text("Nincs gráf – generálj egyet fent!");
      return;
    }

    const positionedNodes = graph.nodes;

    const nodeMap = new Map<string, { x: number; y: number }>();
    positionedNodes.forEach((n) => nodeMap.set(n.id, { x: n.x, y: n.y }));

    const rawEdges = graph.edges;

    const edgeGroups = new Map<string, Edge[]>();

    for (const e of rawEdges) {
      const s = Number(e.source);
      const t = Number(e.target);
      const key = s < t ? `${s}__${t}` : `${t}__${s}`;


      if (!edgeGroups.has(key)) {
        edgeGroups.set(key, []);
      }
      edgeGroups.get(key)!.push(e);
    }

    const curvedEdges: CurvedEdge[] = [];

    edgeGroups.forEach((group) => {
      const count = group.length;
      group.forEach((e, idx) => {
        curvedEdges.push({
          ...e,
          parallelIndex: idx,
          parallelCount: count,
        });
      });
    });

    edgeLayer
      .append("g")
      .selectAll("path")
      .data(curvedEdges)
      .enter()
      .append("path")
      .attr("class", "edge") 
      .attr("d", (d) => {
        const s = nodeMap.get(d.source);
        const t = nodeMap.get(d.target);
        if (!s || !t) return "";

        const x1 = s.x;
        const y1 = s.y;
        const x2 = t.x;
        const y2 = t.y;

        const dx = x2 - x1;
        const dy = y2 - y1;

        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2;

        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;

        const offsetIndex = d.parallelIndex - (d.parallelCount - 1) / 2;
        const offset = 30;
        const cx = mx + nx * offset * offsetIndex;
        const cy = my + ny * offset * offsetIndex;

        return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
      })
      .attr("fill", "none")
      .attr("stroke", (d) =>
        d.id === selectedEdgeId ? "#ef4444" : "#4b5563"
      )
      .attr("stroke-width", (d) =>
        d.id === selectedEdgeId ? 4 : 2
      )
      .attr("stroke-linecap", "round");

    const nodeGroup = nodeLayer.selectAll("g").data(positionedNodes).enter().append("g");

    nodeGroup
    .append("circle")
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .attr("r", 18)
    .attr("fill", (d) =>
      mergePair && (d.id === mergePair.u || d.id === mergePair.v)
        ? "#eab308" 
        : "#0ea5e9"
    )
    .attr("stroke", "#e5e7eb")
    .attr("stroke-width", 2)
    .call((selection) => {
      if (!mergePair) return;

      const u = positionedNodes.find((n) => n.id === mergePair.u);
      const v = positionedNodes.find((n) => n.id === mergePair.v);
      if (!u || !v) return;

      const centerX = (u.x + v.x) / 2;
      const centerY = (u.y + v.y) / 2;

      selection
        .filter(
          (d: any) => d.id === mergePair.u || d.id === mergePair.v
        )
        .transition()
        .duration(500)
        .attr("cx", centerX)
        .attr("cy", centerY)
        .attr("r", 0);
    });

    nodeGroup
      .selectAll<SVGCircleElement, Node>("circle")
      .on("click", function (event, d) {
        onNodeClick?.(d.id);
    });


    const updateEdgesForNode = (nodeId: string) => {
      svg.selectAll<SVGPathElement, any>("path.edge")
        .filter((edge) => edge.source === nodeId || edge.target === nodeId)
        .attr("d", (edge) => {
          const s = nodeMap.get(edge.source)!;
          const t = nodeMap.get(edge.target)!;

          const x1 = s.x;
          const y1 = s.y;
          const x2 = t.x;
          const y2 = t.y;

          const dx = x2 - x1;
          const dy = y2 - y1;
          const mx = (x1 + x2) / 2;
          const my = (y1 + y2) / 2;
          const len = Math.sqrt(dx * dx + dy * dy);
          const nx = -dy / len;
          const ny = dx / len;

          const offset = 12;
          const offsetIndex =
            edge.parallelIndex - (edge.parallelCount - 1) / 2;

          const cx = mx + nx * offset * offsetIndex;
          const cy = my + ny * offset * offsetIndex;

          return `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`;
        });
    };

    const drag = d3
    .drag<any, any>()
    .subject((event, d) => d) 
    .on("start", function (event, d) {
      d3.select(this).classed("active", true);
    })
    .on("drag", function (event, d) {
      const [px, py] = d3.pointer(event, nodeLayer.node());

      d.x = px;
      d.y = py;

      d3.select(this)
        .attr("cx", d.x)
        .attr("cy", d.y);
      
      nodeMap.set(d.id, { x: d.x, y: d.y });

      updateEdgesForNode(d.id);
    })
    .on("end", function (event, d) {
      d3.select(event.sourceEvent.target).classed("active", false);

      if (onNodePositionChange) {
        onNodePositionChange(d.id, d.x, d.y);
      }
    });

    nodeGroup.on("pointerdown", function (event, d) {
      d._pointerDown = {
        x: event.clientX,
        y: event.clientY,
        t: performance.now(),
      };
    });

    nodeGroup.on("pointerup", function (event, d) {
      const start = d._pointerDown;
      d._pointerDown = null;
      if (!start) return;

      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      const dist = Math.hypot(dx, dy);
      const elapsed = performance.now() - start.t;

      if (dist < 5 && elapsed < 300) {
        if (onNodeClick) {
          onNodeClick(d.id);
        }
      }
    });

    nodeGroup
    .selectAll<SVGCircleElement, any>("circle")
    .call(drag as any);

    nodeGroup
      .append("text")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y + 4)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .style("font-size", "12px")
      .style("font-weight", "600")
  }, [graph]);

  return (
    <div
      style={{
        borderRadius: "0.75rem",
        border: "1px solid #1f2937",
        background: "#020617",
        padding: "1rem",
      }}
    >
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{ display: "block", margin: "0 auto" }}
      />
    </div>
  );
};

export default GraphCanvas;
