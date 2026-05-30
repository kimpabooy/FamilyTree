import { useCallback } from "react";
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type NodeChange,
  type EdgeChange,
  type Connection,
  type Node,
} from "@xyflow/react";
import BasicFlow from "../canvas/FamilyTreeCanvas";
import { useFamilyTreeFlow } from "../../../hooks/useFamilyTreeView";

interface FamilyFlowProps {
  familyTreeId: number;
}

/*
 * FamilyFlow — visar ett befintligt familjeträd.
 * Ansvarar för: hämta data, hantera callbacks, skicka allt vidare till BasicFlow.
 */
export default function FamilyFlow({ familyTreeId }: FamilyFlowProps) {
  const {
    nodes,
    edges,
    loading,
    error,
    setNodes,
    setEdges,
    addParentChildEdge,
    removeEdge,
  } = useFamilyTreeFlow(familyTreeId);

  const onNodesChange = useCallback(
    (changes: NodeChange<Node>[]) =>
      setNodes((prev) => applyNodeChanges(changes, prev)),
    [setNodes],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((prev) => applyEdgeChanges(changes, prev)),
    [setEdges],
  );

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
    <BasicFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onEdgesDelete={onEdgesDelete}
    />
  );
}
