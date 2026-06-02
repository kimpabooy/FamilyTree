import { useStore, type ReactFlowState } from "@xyflow/react";

/**
 * GroundLineOverlay — ritar marklinjen (Y=0 i flow-koordinater) som en
 * SVG-linje direkt på canvasytan. Följer zoom och pan automatiskt.
 * Placera den som ett barn inuti <ReactFlow>.
 */
export default function GroundLineOverlay() {
  // Hämta transform (pan + zoom) och viewport-bredd från React Flow store
  const transform = useStore((s: ReactFlowState) => s.transform);
  const width = useStore((s: ReactFlowState) => s.width);

  const [tx, ty, zoom] = transform;
  const lineStartX = -tx / zoom;
  const lineEndX = (width - tx) / zoom;

  return (
    <svg
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 5,
        overflow: "visible",
      }}
    >
      <g transform={`translate(${tx}, ${ty}) scale(${zoom})`}>
        <line
          x1={lineStartX}
          y1={0}
          x2={lineEndX}
          y2={0}
          stroke="#92400e"
          strokeWidth={8 / zoom}
          strokeOpacity={0.55}
          strokeDasharray="0"
        />

        {/* Etikett */}
        <text
          x={lineEndX - 8 / zoom}
          y={-6 / zoom}
          textAnchor="end"
          fontSize={10 / zoom}
          fill="#92400e"
          fillOpacity={0.75}
          letterSpacing="0.08em"
          style={{ textTransform: "uppercase", userSelect: "none" }}
        >
          ▲ LEVANDE &nbsp;&nbsp; ▼ AVLIDNA
        </text>
      </g>
    </svg>
  );
}
