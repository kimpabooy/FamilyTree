import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
  type EdgeProps,
} from "@xyflow/react";

export default function RelationEdge(props: EdgeProps) {
  const { deleteElements } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath(props);

  const onDelete = async () => {
    await deleteElements({
      edges: [{ id: props.id, source: props.source, target: props.target }],
    });
  };

  return (
    <>
      <BaseEdge
        path={edgePath}
        style={props.style}
        markerEnd={props.markerEnd}
      />
      <EdgeLabelRenderer>
        <button
          type="button"
          aria-label="Ta bort koppling"
          title="Ta bort koppling"
          onClick={onDelete}
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all",
            width: 14,
            height: 14,
            borderRadius: 999,
            border: "1px solid #d1d5db",
            background: "#ffffff",
            color: "#991b1b",
            cursor: "pointer",
            gap: 1000,
            fontSize: 12,
            lineHeight: 1,
            display: "grid",
            placeItems: "center",
            boxShadow: "0 1px 4px rgba(0, 0, 0, 0.12)",
          }}
        >
          ×
        </button>
      </EdgeLabelRenderer>
    </>
  );
}
