import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { Person } from "../../../types/Models";
// import { Gender } from "../../../types/Enums";
import Blad from "../../Ui/Leaf";

interface CustomPersonNodeData {
  person: Person;
  [key: string]: unknown;
}

export default function CustomPersonNode({ data }: NodeProps) {
  const nodeData = data as CustomPersonNodeData;
  const { person } = nodeData;

  // ── CustomPersonNode — visuellt kort med namn, födelseår och anslutningspunkter ──────────────────────────
  return (
    <div
      style={{
        position: "relative",
        width: 120,
        height: 180,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        cursor: "default",
      }}
    >
      <Blad
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          borderRadius: 8,
          padding: "8px 12px",
          fontSize: 14,
          //   border: "1px solid red",
          transform: "rotate(-30deg)",
          width: 100,
          height: 100,
          textAlign: "center",
        }}
      >
        {/* {Anslutningspunkt uppåt — för föräldra-kanter } */}
        <Handle
          type="target"
          position={Position.Bottom}
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
    </div>
  );
}