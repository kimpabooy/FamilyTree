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
import RelationEdge from "../edges/FamilyRelationEdge";
import GroundLineOverlay from "./GroundLineOverlay";

/*
  Nodtyper:
    "person"   — levande person (ovan mark)
    "deceased" — avliden person (under mark)
  Kantyper:
    "family"       — förälder-barn, Bezier-kurva
    "partner"      — partnerrelation, streckad Bezier-kurva
    "cross-ground" — korsar marklinjen, rak linje
*/

const nodeTypes: NodeTypes = {
  person: PersonNode,
  deceased: DeceasedPersonNode,
};

const edgeTypes = {
  family: RelationEdge,
  partner: RelationEdge,
  "cross-ground": RelationEdge,
};

interface FamilyTreeCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange<Node>[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  onEdgesDelete: (edges: { id: string }[]) => void;
  /** Read-only-läge — inaktiverar all interaktion utom kamera-pan/zoom */
  readOnly?: boolean;
  /** Callback när en person-nod klickas (används i edit-läge) */
  onNodeClick?: (nodeId: string) => void;
}

export default function FamilyTreeCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onEdgesDelete,
  readOnly = false,
  onNodeClick,
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
        onEdgesDelete={readOnly ? undefined : onEdgesDelete}
        onConnect={readOnly ? undefined : onConnect}
        onNodeClick={
          onNodeClick ? (_event, node) => onNodeClick(node.id) : undefined
        }
        // Read-only: stäng av all interaktion utom kamera
        nodesDraggable={!readOnly}
        nodesConnectable={!readOnly}
        edgesReconnectable={!readOnly}
        elementsSelectable={!readOnly}
        fitView
        fitViewOptions={{ padding: 0.2 }}
      >
        <GroundLineOverlay />
        <Controls showInteractive={!readOnly} />
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
