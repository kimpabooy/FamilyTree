import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FamilyTreeEditView from "../components/Flow/views/FamilyTreeEditView";
import Button from "../components/Ui/Button";
import { deleteFamilyTree } from "../services/FamilytreeService";

export default function FamilyTreeEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const familyTreeId = Number(id);

  const [showAddPanel, setShowAddPanel] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!familyTreeId) {
    return <p style={{ padding: 24 }}>Ogiltigt träd-ID.</p>;
  }

  const handleDeleteTree = async () => {
    const confirmed = window.confirm(
      "Är du säker på att du vill ta bort hela familjeträdet? Detta går inte att ångra.",
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      await deleteFamilyTree(familyTreeId);
      navigate("/familytree");
    } catch (err) {
      console.error("Kunde inte ta bort trädet:", err);
      alert("Något gick fel. Trädet kunde inte tas bort.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="familytree-page">
      <div className="familytree-page-toolbar">
        <Button
          label="← Tillbaka till vyn"
          variant="secondary"
          onClick={() => navigate(`/familytree/${familyTreeId}`)}
        />
        <Button
          label="+ Lägg till person"
          variant="primary"
          onClick={() => setShowAddPanel(true)}
        />
        <Button
          label={deleting ? "Tar bort..." : "Ta bort trädet"}
          variant="danger"
          onClick={handleDeleteTree}
        />
      </div>

      <div className="familytree-page-canvas">
        <FamilyTreeEditView
          familyTreeId={familyTreeId}
          addPersonPanelOpen={showAddPanel}
          onAddPersonPanelClose={() => setShowAddPanel(false)}
        />
      </div>
    </div>
  );
}
