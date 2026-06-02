import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { Person } from "../../../types/Models";
import { Gender } from "../../../types/Enums";

interface PersonNodeData {
  person: Person;
  [key: string]: unknown;
}

const genderStyle: Record<number, { bg: string; border: string }> = {
  [Gender.Male]: { bg: "#dbeafe", border: "#93c5fd" },
  [Gender.Female]: { bg: "#fce7f3", border: "#f9a8d4" },
  [Gender.Other]: { bg: "#f3f4f6", border: "#d1d5db" },
};

export default function PersonNode({ data }: NodeProps) {
  const nodeData = data as PersonNodeData;
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
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        cursor: "default",
        userSelect: "none",
      }}
    >
      {/* Anslutningspunkt uppåt — för föräldra-kanter */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#9ca3af" }}
      />

      <div style={{ fontWeight: 600, color: "#1f2937" }}>
        {person.firstName} {person.lastName}
      </div>

      {person.birthDate && (
        <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>
          {new Date(person.birthDate).getFullYear()}
        </div>
      )}

      {/* Anslutningspunkt nedåt — för barn-kanter */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: "#9ca3af" }}
      />
    </div>
  );
}
