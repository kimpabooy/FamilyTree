import "@xyflow/react/dist/style.css";
import RelationEdge from "./RelationEdge";
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
} from "@xyflow/react";

const edgeTypes = {
  "parent-child": RelationEdge,
  partner: RelationEdge,
};

interface BasicFlowProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange<Node>[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  onEdgesDelete: (edges: { id: string }[]) => void;
}

/**
 * BasicFlow — ren React Flow-canvas utan någon backend-kännedom.
 * Ta emot nodes/edges och callbacks som props utifrån.
 * Använd den som "motorn" i FamilyFlow och CreateFamilyFlow.
 */
export default function BasicFlow({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onEdgesDelete,
}: BasicFlowProps) {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        edgeTypes={edgeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onEdgesDelete={onEdgesDelete}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background />
      </ReactFlow>
    </div>
  );
}
