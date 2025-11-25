import React from "react";

interface GraphControlsProps {
  nodeCount: number;
  edgeProb: number;
  onNodeCountChange: (value: number) => void;
  onEdgeProbChange: (value: number) => void;
  onGenerate: () => void;
  onRunKarger: () => void;
  onNextStep: () => void;
}

const GraphControls: React.FC<GraphControlsProps> = ({
  nodeCount,
  edgeProb,
  onNodeCountChange,
  onEdgeProbChange,
  onGenerate,
  onRunKarger,
  onNextStep,
}) => {
  return (
    <div
      style={{
        marginBottom: "1rem",
        padding: "1rem",
        borderRadius: "0.75rem",
        background: "#020617",
        border: "1px solid #1f2937",
        display: "flex",
        gap: "1rem",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <div>
        <label style={{ fontSize: "0.875rem", display: "block" }}>
          Csúcsok száma
        </label>
        <input
          type="number"
          min={2}
          max={20}
          value={nodeCount}
          onChange={(e) => onNodeCountChange(Number(e.target.value))}
          style={{
            padding: "0.25rem 0.5rem",
            borderRadius: "0.375rem",
            border: "1px solid #374151",
            background: "#020617",
            color: "#e5e7eb",
            width: "5rem",
          }}
        />
      </div>

      <div>
        <label style={{ fontSize: "0.875rem", display: "block" }}>
          Él valószínűsége
        </label>
        <input
          type="range"
          min={0.1}
          max={1}
          step={0.05}
          value={edgeProb}
          onChange={(e) => onEdgeProbChange(Number(e.target.value))}
        />
        <span style={{ marginLeft: "0.5rem", fontSize: "0.875rem" }}>
          {edgeProb.toFixed(2)}
        </span>
      </div>

      <button
        onClick={onGenerate}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "9999px",
          border: "none",
          background:
            "linear-gradient(135deg, rgb(14,165,233), rgb(59,130,246))",
          color: "white",
          cursor: "pointer",
          fontWeight: 500,
        }}
      >
        Új gráf
      </button>

      <button
        onClick={onRunKarger}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "9999px",
          border: "1px solid #e5e7eb33",
          background: "transparent",
          color: "#e5e7eb",
          cursor: "pointer",
        }}
      >
        Karger futtatása
      </button>

      <button
        onClick={onNextStep}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "9999px",
          border: "1px solid #e5e7eb33",
          background: "transparent",
          color: "#e5e7eb",
          cursor: "pointer",
        }}
      >
        Következő lépés
      </button>
    </div>
  );
};

export default GraphControls;
