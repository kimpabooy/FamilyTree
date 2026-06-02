import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  getStraightPath,
  useReactFlow,
  type EdgeProps,
} from "@xyflow/react";

/**
 * RelationEdge — hanterar tre kanttyper:
 *   "family"       — förälder-barn, Bezier-kurva
 *   "partner"      — partnerrelation, streckad Bezier
 *   "cross-ground" — korsar marklinjen, rak linje
 *
 * data.readOnly = true → döljer delete-knappen (används i read-only-läge)
 */
export default function RelationEdge(props: EdgeProps) {
  const { deleteElements } = useReactFlow();
  const isReadOnly =
    (props.data as { readOnly?: boolean } | undefined)?.readOnly === true;
  const isCrossGround = props.type === "cross-ground";

  const [edgePath, labelX, labelY] = isCrossGround
    ? getStraightPath(props)
    : getBezierPath(props);

  const onDelete = async () => {
    await deleteElements({
      edges: [{ id: props.id, source: props.source, target: props.target }],
    });
  };

  return (
    <>
      <BaseEdge
        path={edgePath}
        style={{
          ...props.style,
          ...(isCrossGround && {
            stroke: "#9ca3af",
            strokeWidth: 1.5,
            opacity: 0.25,
            strokeDasharray: "4 3",
          }),
        }}
        markerEnd={props.markerEnd}
      />

      {/* Delete-knapp — visas bara i edit-läge */}
      {!isReadOnly && (
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
      )}
    </>
  );
}
