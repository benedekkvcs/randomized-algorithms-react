import React, { useState, useCallback, useEffect } from "react";
import GraphControls from "../components/GraphViewer/GraphControls";
import GraphCanvas from "../components/GraphViewer/GraphCanvas";
import { generateRandomGraph, runKargerSteps} from "../algorithms/karger";
import type { KargerStep } from "../algorithms/karger";
import type { Graph } from "../components/GraphViewer/types";

const KargerPage: React.FC = () => {
  const [nodeCount, setNodeCount] = useState<number>(6);
  const [edgeProb, setEdgeProb] = useState<number>(0.4);
  const [graph, setGraph] = useState<Graph>({nodes: generateRandomGraph(nodeCount), edges: []});
  const [kargerSteps, setKargerSteps] = useState<KargerStep[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [edgeStartNode, setEdgeStartNode] = useState<string | null>(null);


  const handleGenerate = useCallback(() => {
    setGraph({nodes: generateRandomGraph(nodeCount), edges: []});
    setKargerSteps([]);
    setStepIndex(0);
  }, [nodeCount, edgeProb]);

  
  const handleRunKarger = useCallback(() => {
    const steps = runKargerSteps(graph);

    setKargerSteps(steps);
    setStepIndex(0);

    if (steps.length > 0) {
      setGraph(structuredClone(steps[0].graph));
    }
  }, [graph]);

  
  const nextStep = useCallback(() => {
    if (stepIndex < kargerSteps.length - 1) {
      const newIndex = stepIndex + 1;

      setStepIndex(newIndex);
      setGraph(structuredClone(kargerSteps[newIndex].graph));
    }
  }, [stepIndex, kargerSteps]);

  useEffect(() => {
   
    if (stepIndex % 2 === 1 && stepIndex < kargerSteps.length - 1) {
      const timer = setTimeout(() => {
        
        const newIndex = stepIndex + 1;
        setStepIndex(newIndex);
        setGraph(structuredClone(kargerSteps[newIndex].graph));
      }, 500); 
      
      return () => clearTimeout(timer);
    }
  }, [stepIndex, kargerSteps]);


  const selectedEdgeId = kargerSteps[stepIndex]?.selectedEdgeId;

  return (
    <div>
      <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>
        Karger min-cut algoritmus – vizualizáció (alapváz)
      </h2>
      <p style={{ marginBottom: "1rem", maxWidth: "60ch", fontSize: "0.9rem", color: "#9ca3af" }}>
        Ez az oldal véletlen gráfokat generál, és később lépésenként meg fogja jeleníteni a
        Karger algoritmus összehúzásos lépéseit. Jelenleg a grafikus motor működik –
        ebből indulunk ki, és erre építjük rá az algoritmus animációját.
      </p>

      <GraphControls
        nodeCount={nodeCount}
        edgeProb={edgeProb}
        onNodeCountChange={setNodeCount}
        onEdgeProbChange={setEdgeProb}
        onGenerate={handleGenerate}
        onRunKarger={handleRunKarger}
        onNextStep={nextStep}
      />

      <GraphCanvas graph={graph} selectedEdgeId={selectedEdgeId} 
      mergePair={kargerSteps[stepIndex]?.mergePair }
      onNodePositionChange={(id, x, y) => {
      setGraph((prev) => ({
        ...prev,
        nodes: prev.nodes.map((n) =>  
          n.id === id ? { ...n, x, y } : n
        ),
      }));}} 
      onNodeClick={(id) => {
        if (!edgeStartNode) {
          
          setEdgeStartNode(id);
          console.log("[FIRST CLICK] start=", id);
        } else {
          console.log("[SECOND CLICK] start=", edgeStartNode, "end=", id);

          
          const newEdge = {
            id: crypto.randomUUID(),
            source: edgeStartNode,
            target: id
          };

          console.log("[ADDING EDGE TO GRAPH]", newEdge);

          setGraph((prev) => {
                console.log("[BEFORE]", prev.edges);
                const updated = {
                  ...prev,
                  edges: [...prev.edges, newEdge],
                };
                console.log("[AFTER]", updated.edges);
                return updated;
              });

          // reset
          setEdgeStartNode(null);
        }
      }}
    />
    </div>
  );
};

export default KargerPage;
