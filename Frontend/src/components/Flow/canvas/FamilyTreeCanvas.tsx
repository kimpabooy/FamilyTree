import "@xyflow/react/dist/style.css";
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  type NodeChange,
  type EdgeChange,
  type Connection,
  type Node,
  type Edge,
  type NodeTypes,
} from "@xyflow/react";
import PersonNode from "../nodes/PersonNode";
import DeceasedPersonNode from "../nodes/DeceasedPersonNode";
import GroundNode from "../nodes/GroundNode";
import RelationEdge from "../edges/FamilyRelationEdge";

/*
  Nodtyper:
    "person"   — levande person (ovan mark)
    "deceased" — avliden person (under mark)
    "ground"   — marklinjen, osynlig separator
  Kantyper:
    "family"   — förälder-barn (visas som RelationEdge)
    "partner"  — partnerrelation (visas som RelationEdge men streckad)
*/

// ── Node- och kantdefinitioner ───────────────────────────────────────────────
const nodeTypes: NodeTypes = {
  person: PersonNode,
  deceased: DeceasedPersonNode,
  ground: GroundNode,
};

const edgeTypes = {
  family: RelationEdge,
  partner: RelationEdge,
};

// ── Canvas-komponenten ───────────────────────────────────────────────────────
interface FamilyTreeCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange<Node>[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  onEdgesDelete: (edges: { id: string }[]) => void;
}

// FamilyTreeCanvas — wrapper för ReactFlow som sätter upp nod- och kanttyper
// och hanterar callbacks. Själva layouten och datan hanteras av hooken useFamilyTreeView.
export default function FamilyTreeCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onEdgesDelete,
}: FamilyTreeCanvasProps) {
  return (
    <div style={{ width: "100%", height: "100%", touchAction: "none" }}>
      <ReactFlow
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onEdgesDelete={onEdgesDelete}
        onConnect={onConnect}
        fitView
        fitViewOptions={{ padding: 0.2 }}
      >
        <Controls />
        <MiniMap
          className="canvas-minimap"
          nodeColor={(n) => {
            if (n.type === "person") return "#93c5fd";
            if (n.type === "deceased") return "#94a3b8";
            return "#e5e7eb";
          }}
        />
        <Background />
      </ReactFlow>
    </div>
  );
}
