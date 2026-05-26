import { useCallback } from "react";
import "@xyflow/react/dist/style.css";
import { useFamilyTreeFlow } from "../../hooks/useFamilyTree";
import ParentChildEdge from "./ParentChildEdge";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Controls,
  MiniMap,
  Background,
  type NodeChange,
  type EdgeChange,
  type Connection,
  type Node,
} from "@xyflow/react";

const FAMILY_TREE_ID = 2; // Byt till det träd du vill visa

export default function BasicFlow() {
  const {
    nodes,
    edges,
    loading,
    error,
    setNodes,
    setEdges,
    addParentChildEdge,
    removeEdge,
  } = useFamilyTreeFlow(FAMILY_TREE_ID);

  // Hantera ändringar i noder och kanter som görs av React Flow (t.ex. flytta noder, ändra kanter)
  const onNodesChange = useCallback(
    (changes: NodeChange<Node>[]) =>
      setNodes((prev) => applyNodeChanges(changes, prev)),
    [setNodes],
  );

  // Hantera ändringar i kanter som görs av React Flow (t.ex. flytta kanter).
  // Een "edge" i detta sammanhang är en relation mellan två noder (förälder-barn).
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((prev) => applyEdgeChanges(changes, prev)),
    [setEdges],
  );

  // När användaren drar en linje mellan två noder skapas en förälder-barn-relation
  const onConnect = useCallback(
    async (params: Connection) => {
      const parentId = Number(params.source);
      const childId = Number(params.target);
      try {
        await addParentChildEdge(parentId, childId);
      } catch (err) {
        console.error("Kunde inte skapa relation:", err);
        setEdges((prev) => addEdge(params, prev));
      }
    },
    [addParentChildEdge, setEdges],
  );

  // När en koppling tas bort, ta bort relationen i backend
  const onEdgesDelete = useCallback(
    async (deletedEdges: { id: string }[]) => {
      try {
        await Promise.all(deletedEdges.map((edge) => removeEdge(edge.id)));
      } catch (err) {
        console.error("Kunde inte ta bort relation:", err);
      }
    },
    [removeEdge],
  );

  if (loading) return <p style={{ padding: 24 }}>Laddar familjeträd...</p>;
  if (error) return <p style={{ padding: 24, color: "red" }}>Fel: {error}</p>;

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        edgeTypes={{ "parent-child": ParentChildEdge }}
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
