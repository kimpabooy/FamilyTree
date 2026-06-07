import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  getStraightPath,
  useReactFlow,
  type EdgeProps,
} from "@xyflow/react";

/**
 * FamilyRelationEdge
 *
 * Kanttyper:
 *   "family"       — förälder-barn, mjuk Bezier-kurva (standard React Flow-stil)
 *   "partner"      — partnerrelation, streckad rak linje
 *   "cross-ground" — korsar marklinjen, tunn halvtransparent linje
 *
 * data.readOnly = true → döljer delete-knappen
 */
export default function FamilyRelationEdge(props: EdgeProps) {
  const { deleteElements } = useReactFlow();

  const { id, type, data, style, markerEnd } = props;

  const isReadOnly =
    (data as { readOnly?: boolean } | undefined)?.readOnly === true;
  const isCrossGround = type === "cross-ground";
  const isPartner = type === "partner";

  const onDelete = async () => {
    await deleteElements({
      edges: [{ id, source: props.source, target: props.target }],
    });
  };

  // ── Cross-ground: rak, tunn, halvtransparent ──────────────────────────────
  if (isCrossGround) {
    const [path, labelX, labelY] = getStraightPath(props);
    return (
      <>
        <path
          d={path}
          fill="none"
          stroke="#9ca3af"
          strokeWidth={1.5}
          strokeOpacity={0.25}
          strokeDasharray="4 3"
        />
        {!isReadOnly && (
          <EdgeLabelRenderer>
            <DeleteButton x={labelX} y={labelY} onDelete={onDelete} />
          </EdgeLabelRenderer>
        )}
      </>
    );
  }

  // ── Partner: streckad rak linje ───────────────────────────────────────────
  if (isPartner) {
    const [path, labelX, labelY] = getStraightPath(props);
    const partnerColor =
      (style as React.CSSProperties | undefined)?.stroke ?? "#e879a0";
    return (
      <>
        <path
          d={path}
          fill="none"
          stroke={String(partnerColor)}
          strokeWidth={1.5}
          strokeDasharray="6 3"
          strokeOpacity={0.8}
        />
        {!isReadOnly && (
          <EdgeLabelRenderer>
            <DeleteButton x={labelX} y={labelY} onDelete={onDelete} />
          </EdgeLabelRenderer>
        )}
      </>
    );
  }

  // ── Family: mjuk Bezier-kurva (React Flow standard) ───────────────────────
  const [edgePath, labelX, labelY] = getBezierPath(props);

  return (
    <>
      <BaseEdge
        path={edgePath}
        style={{
          ...props.style,
          stroke: "#6b7280",
          strokeWidth: 1.5,
        }}
        markerEnd={markerEnd}
      />
      {!isReadOnly && (
        <EdgeLabelRenderer>
          <DeleteButton x={labelX} y={labelY} onDelete={onDelete} />
        </EdgeLabelRenderer>
      )}
    </>
  );
}

function DeleteButton({
  x,
  y,
  onDelete,
}: {
  x: number;
  y: number;
  onDelete: () => void;
}) {
  return (
    <button
      type="button"
      aria-label="Ta bort koppling"
      title="Ta bort koppling"
      onClick={onDelete}
      style={{
        position: "absolute",
        transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
        pointerEvents: "all",
        width: 16,
        height: 16,
        borderRadius: 999,
        border: "1px solid #d1d5db",
        background: "#ffffffee",
        color: "#991b1b",
        cursor: "pointer",
        fontSize: 12,
        lineHeight: 1,
        display: "grid",
        placeItems: "center",
        boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
      }}
    >
      ×
    </button>
  );
}
