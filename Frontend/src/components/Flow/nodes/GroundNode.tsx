import type { NodeProps } from "@xyflow/react";

// GroundNode — marklinjen som skiljer levande (träd) från avlidna (rötter).
export default function GroundNode(_props: NodeProps) {
  return (
    <div
      style={{
        width: "100%",
        height: 4,
        position: "relative",
        pointerEvents: "none",
      }}
    >
      {/* Själva linjen/marken */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background:
            "linear-gradient(90deg, transparent, #92400e 10%, #92400e 90%, transparent)",
          borderRadius: 2,
          opacity: 0.6,
        }}
      />

      {/* Etiketten som i mitten */}
      <div
        style={{
          position: "absolute",
          top: 8,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 11,
          color: "#92400e",
          opacity: 0.7,
          whiteSpace: "nowrap",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          userSelect: "none",
        }}
      >
        ▲ levande &nbsp;&nbsp; ▼ avlidna
      </div>
    </div>
  );
}