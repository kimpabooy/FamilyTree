import { useCallback } from "react";
import {
  applyNodeChanges,
  type NodeChange,
  type EdgeChange,
  type Connection,
  type Node,
} from "@xyflow/react";
import FamilyTreeCanvas from "../canvas/FamilyTreeCanvas";
import { useFamilyTreeView } from "../../../hooks/useFamilyTreeView";

interface FamilyTreeViewProps {
  familyTreeId: number;
}

export default function FamilyTreeView({ familyTreeId }: FamilyTreeViewProps) {
  const {
    nodes,
    edges,
    loading,
    error,
    setNodes,
    addParentChildEdge,
    removeEdge,
  } = useFamilyTreeView(familyTreeId);

  const onNodesChange = useCallback(
    (changes: NodeChange<Node>[]) =>
      setNodes((prev) => applyNodeChanges(changes, prev)),
    [setNodes],
  );

  // Edgorna hanteras via onConnect och onEdgesDelete, så vi ignorerar onEdgesChange
  const onEdgesChange = useCallback((_changes: EdgeChange[]) => {}, []);

  const onConnect = useCallback(
    async (params: Connection) => {
      const parentId = Number(params.source);
      const childId = Number(params.target);
      try {
        await addParentChildEdge(parentId, childId);
      } catch (err) {
        console.error("Kunde inte skapa relation:", err);
      }
    },
    [addParentChildEdge],
  );

  const onEdgesDelete = useCallback(
    async (deletedEdges: { id: string }[]) => {
      try {
        await Promise.all(deletedEdges.map((e) => removeEdge(e.id)));
      } catch (err) {
        console.error("Kunde inte ta bort relation:", err);
      }
    },
    [removeEdge],
  );

  if (loading) return <p style={{ padding: 24 }}>Laddar familjeträd...</p>;
  if (error) return <p style={{ padding: 24, color: "red" }}>Fel: {error}</p>;

  return (
    <FamilyTreeCanvas
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onEdgesDelete={onEdgesDelete}
    />
  );
}
