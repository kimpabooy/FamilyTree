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

  // Y=0 i flow-koordinater → skärmkoordinat
  const screenY = ty; // ty = translateY = var Y=0 hamnar på skärmen

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
      <line
        x1={0}
        y1={screenY}
        x2={width}
        y2={screenY}
        stroke="#92400e"
        strokeWidth={2}
        strokeOpacity={0.55}
        strokeDasharray="0"
      />

      {/* Etikett */}
      <text
        x={width - 8}
        y={screenY - 6}
        textAnchor="end"
        fontSize={10}
        fill="#92400e"
        fillOpacity={0.7}
        letterSpacing="0.08em"
        style={{ textTransform: "uppercase", userSelect: "none" }}
      >
        ▲ LEVANDE &nbsp;&nbsp; ▼ AVLIDNA
      </text>
    </svg>
  );
}
