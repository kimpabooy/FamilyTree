import { useStore, type ReactFlowState } from "@xyflow/react";

/** TreeOverlay — ritar en vertikal linje som delar in levande och avlidna i trädet.
 * Placera den som ett barn inuti <ReactFlow>. Följer zoom och pan automatiskt.
 */
export default function TreeOverlay() {
  // Hämta transform (pan + zoom) och viewport-höjd från React Flow store
  const transform = useStore((s: ReactFlowState) => s.transform);
  const width = useStore((s: ReactFlowState) => s.width);
  const height = useStore((state: ReactFlowState) => state.height);

  const [tx, ty, zoom] = transform;
  const lineStartX = (width / 2 - tx) / zoom;
  const lineEndX = lineStartX;

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
      {/* placera linje i mitten av skärmen */}
      <g transform={`translate(${tx}, ${ty}) scale(${zoom})`}>
        <line
          x1={lineStartX}
          x2={lineEndX}
          y1={-height / zoom}
          y2={-2 / zoom}
          stroke="#523100"
          strokeWidth={50 / zoom}
          strokeOpacity={1.0}
          strokeDasharray="0"
          z-index={-1}
        />
      </g>
    </svg>
  );
}
