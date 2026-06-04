import {
  EdgeLabelRenderer,
  getStraightPath,
  useReactFlow,
  type EdgeProps,
} from "@xyflow/react";

/*
// ── FamilyRelationEdge — organiska trädgrenar som SVG-paths ──────────────────────────
//
// Kanttyper:
//   "family"       — förälder-barn, quadratic curve med trädbrun färg
//   "partner"      — partnerrelation, streckad horisontell linje
//   "cross-ground" — korsar marklinjen, tunn rak linje
//
// data.readOnly = true → döljer delete-knappen
*/
export default function FamilyRelationEdge(props: EdgeProps) {
  const { deleteElements } = useReactFlow();

  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    type,
    data,
    style,
    markerEnd,
  } = props;

  const isReadOnly =
    (data as { readOnly?: boolean } | undefined)?.readOnly === true;
  const isCrossGround = type === "cross-ground";
  const isPartner = type === "partner";

  const onDelete = async () => {
    await deleteElements({
      edges: [{ id, source: props.source, target: props.target }],
    });
  };

  /*
  // ── Cross-ground: rak, tunn, halvtransparent ──────────────────────────
  // Används för att visuellt skilja "över marken" (family/partner) från "under marken" (cross-ground).
  // Använd getStraightPath för att få en rak linje mellan källan och målet.
  */
  if (isCrossGround) {
    const [path, labelX, labelY] = getStraightPath(props);
    return (
      <>
        <path
          d={path}
          fill="none"
          // stroke="transparent"
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

  /*
  // ── Partner: streckad horisontell/diagonal linje ──────────────────────────
  //  Används för att visa partnerrelationer.
  // Streckad linje för att visuellt skilja från familjeband.
  */
  if (isPartner) {
    const midX = (sourceX + targetX) / 2;
    const midY = (sourceY + targetY) / 2;
    const path = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
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
          strokeOpacity={0.7}
        />
        {!isReadOnly && (
          <EdgeLabelRenderer>
            <DeleteButton x={midX} y={midY} onDelete={onDelete} />
          </EdgeLabelRenderer>
        )}
      </>
    );
  }

  /*
  // ── Family: organisk trädgren ─────────────────────────────────────────────
  //
  // Quadratic Bezier med kontrollpunkten horisontellt centrerad och
  // vertikalt placerad nära källan — ger en "gren som böjer sig neråt"-känsla.
  //
  // Tjockleken minskar med avstånd: nära noder = tunnare (löv), långt = tjockare (stam).
  */
  const dy = Math.abs(targetY - sourceY);
  const strokeWidth = Math.max(1, Math.min(4, dy / 60));

  // Liten organisk wobbleX baserad på x-positionen
  const wobbleX = Math.sin(targetX * 0.05) * 8;
  // const wobbleY = Math.cos(targetX * 0.05) * 4;

  const controlX = sourceX + (targetX - sourceX) * 0.5 + wobbleX;
  const controlY = sourceY + (targetY - sourceY) * 0.35;

  // SVG-pathen för en quadratic Bezier-kurva
  const path = `M ${sourceX} ${sourceY} Q ${controlX} ${controlY} ${targetX} ${targetY}`;
  const midX = sourceX + (targetX - sourceX) * 0.5;
  const midY = sourceY + (targetY - sourceY) * 0.5;
  const gradId = `grad-${id}`;

  // Källan är alltid mörkare (stam), målet ljusare (gren).
  // Gren Färger: mörkare brun → ljusare brun, beroende på riktning (uppåt/neråt).
  const isGoingDown = targetY < sourceY;
  const darkColor = "#080604";
  const lightColor = "#8b6340";
  // const darkColor = "#5c3d1e";
  // const lightColor = "#8b6340";

  return (
    <>
      <defs>
        <linearGradient
          id={gradId}
          x1={sourceX}
          y1={sourceY}
          x2={targetX}
          y2={targetY}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={isGoingDown ? darkColor : lightColor} />
          <stop
            offset="100%"
            stopColor={isGoingDown ? lightColor : darkColor}
          />
        </linearGradient>
      </defs>

      {/* Skugga/djup-lager — lite mörkare och bredare under huvudlinjen */}
      <path
        d={path}
        fill="none"
        stroke="#3b2510"
        strokeWidth={strokeWidth + 1}
        strokeOpacity={0.12}
        strokeLinecap="round"
      />

      {/* Huvud-grenen */}
      <path
        d={path}
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        markerEnd={markerEnd}
      />

      {/* Delete-knapp */}
      {!isReadOnly && (
        <EdgeLabelRenderer>
          <DeleteButton x={midX} y={midY} onDelete={onDelete} />
        </EdgeLabelRenderer>
      )}
    </>
  );
}

// ── Delete-knapp ──────────────────────────────────────────────────────────────

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
