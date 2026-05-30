import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { Person } from "../../../types/Models";
import { Gender } from "../../../types/Enums";

interface DeceasedPersonNodeData {
  person: Person;
  [key: string]: unknown;
}

const genderStyle: Record<number, { bg: string; border: string }> = {
  [Gender.Male]: { bg: "#e0e7ef", border: "#94a3b8" },
  [Gender.Female]: { bg: "#ede0e7", border: "#a894a8" },
  [Gender.Other]: { bg: "#e5e7eb", border: "#9ca3af" },
};

/**
 * DeceasedPersonNode — visar en avliden person.
 * Samma struktur som PersonNode men med avskalad, gråaktig stil
 * och en liten dödsdatum-rad.
 * Placeras under marklinjen (rötter).
 */

export default function DeceasedPersonNode({ data }: NodeProps) {
  const nodeData = data as DeceasedPersonNodeData;
  const { person } = nodeData;
  const style = genderStyle[person.gender] ?? genderStyle[2];

  return (
    <div
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        borderRadius: 8,
        padding: "8px 12px",
        fontSize: 13,
        width: 200,
        textAlign: "center",
        opacity: 0.85,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        cursor: "default",
        userSelect: "none",
      }}
    >
      <Handle
        type="target"
        position={Position.Bottom}
        style={{ background: "#9ca3af" }}
      />

      <div style={{ fontWeight: 600, color: "#374151" }}>
        {person.firstName} {person.lastName}
      </div>

      <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>
        {person.birthDate ? new Date(person.birthDate).getFullYear() : "?"}
        {" – "}
        {person.deathDate ? new Date(person.deathDate).getFullYear() : "?"}
      </div>

      <Handle
        type="source"
        position={Position.Top}
        style={{ background: "#9ca3af" }}
      />
    </div>
  );
}
