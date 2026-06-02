import { useCallback, useMemo, useState } from "react";
import { applyNodeChanges, type NodeChange, type Node } from "@xyflow/react";
import FamilyTreeCanvas from "../canvas/FamilyTreeCanvas";
import { useFamilyTreeView } from "../../../hooks/useFamilyTreeView";
import type { Person } from "../../../types/Models";
import { Gender } from "../../../types/Enums";

interface FamilyTreeViewProps {
  familyTreeId: number;
}

/**
 * FamilyTreeView — read-only visning.
 * Pan/zoom tillåtet, inga redigeringsinteraktioner, inga ×-knappar på kanter.
 */
export default function FamilyTreeView({ familyTreeId }: FamilyTreeViewProps) {
  const { nodes, edges, loading, error, setNodes } = useFamilyTreeView(
    familyTreeId,
    true,
  ); // readOnly=true → kanter får data.readOnly
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const selectedPersonDetails = useMemo(() => {
    if (!selectedPerson) return null;

    const birthYear = selectedPerson.birthDate
      ? new Date(selectedPerson.birthDate).getFullYear()
      : null;
    const deathYear = selectedPerson.deathDate
      ? new Date(selectedPerson.deathDate).getFullYear()
      : null;

    return {
      birthYear,
      deathYear,
      genderLabel:
        selectedPerson.gender === Gender.Male
          ? "Man"
          : selectedPerson.gender === Gender.Female
            ? "Kvinna"
            : "Annat / okänt",
      status: selectedPerson.deathDate ? "Avliden" : "Levande",
    };
  }, [selectedPerson]);

  const activePerson = useMemo(() => {
    if (!selectedPerson) return null;
    return nodes.some((node) => node.id === String(selectedPerson.id))
      ? selectedPerson
      : null;
  }, [nodes, selectedPerson]);

  const onNodeClick = useCallback(
    (nodeId: string) => {
      const node = nodes.find((currentNode) => currentNode.id === nodeId);
      const person = node?.data?.person as Person | undefined;
      setSelectedPerson(person ?? null);
    },
    [nodes],
  );

  const onNodesChange = useCallback(
    (changes: NodeChange<Node>[]) =>
      setNodes((prev) => applyNodeChanges(changes, prev)),
    [setNodes],
  );

  if (loading) return <p style={{ padding: 24 }}>Laddar familjeträd...</p>;
  if (error) return <p style={{ padding: 24, color: "red" }}>Fel: {error}</p>;

  return (
    <div style={{ display: "flex", height: "100%", width: "100%" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <FamilyTreeCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={() => {}}
          onConnect={() => {}}
          onEdgesDelete={() => {}}
          onNodeClick={onNodeClick}
          readOnly
        />
      </div>

      {activePerson && selectedPersonDetails && (
        <aside className="edit-panel" aria-label="Personinformation">
          <div className="edit-panel-header">
            <h3 className="edit-panel-heading">
              {activePerson.firstName} {activePerson.lastName}
            </h3>
            <button
              className="edit-panel-close"
              onClick={() => setSelectedPerson(null)}
              aria-label="Stäng informationspanelen"
            >
              ×
            </button>
          </div>

          <div className="edit-panel-body">
            <div>
              <div className="edit-panel-field-label">Förnamn</div>
              <div className="edit-panel-field-value">
                {activePerson.firstName}
              </div>
            </div>

            <div>
              <div className="edit-panel-field-label">Efternamn</div>
              <div className="edit-panel-field-value">
                {activePerson.lastName}
              </div>
            </div>

            <div>
              <div className="edit-panel-field-label">Kön</div>
              <div className="edit-panel-field-value">
                {selectedPersonDetails.genderLabel}
              </div>
            </div>

            <div>
              <div className="edit-panel-field-label">Status</div>
              <div className="edit-panel-field-value">
                {selectedPersonDetails.status}
              </div>
            </div>

            <div>
              <div className="edit-panel-field-label">Födelseår</div>
              <div className="edit-panel-field-value">
                {selectedPersonDetails.birthYear ?? "Okänt"}
              </div>
            </div>

            <div>
              <div className="edit-panel-field-label">Dödsår</div>
              <div className="edit-panel-field-value">
                {selectedPersonDetails.deathYear ?? "-"}
              </div>
            </div>
          </div>

          <div className="edit-panel-actions">
            <button
              className="flow-btn flow-btn--ghost"
              onClick={() => setSelectedPerson(null)}
            >
              Stäng
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}
