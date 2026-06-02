import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FamilyTreeEditView from "../components/Flow/views/FamilyTreeEditView";
import Button from "../components/Ui/Button";
import type { Gender } from "../types/Enums";

export default function FamilyTreeEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const familyTreeId = Number(id);

  // ── "Lägg till person"-panel ──────────────────────────────────────────────
  const [showAddPanel, setShowAddPanel] = useState(false);

  if (!familyTreeId) {
    return <p style={{ padding: 24 }}>Ogiltigt träd-ID.</p>;
  }

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
      </div>

      <div className="familytree-page-canvas">
        <FamilyTreeEditView
          familyTreeId={familyTreeId}
          /* Skickar in panel-state så editvyn kan stänga den efter sparning */
          addPersonPanelOpen={showAddPanel}
          onAddPersonPanelClose={() => setShowAddPanel(false)}
        />
      </div>
    </div>
  );
}
