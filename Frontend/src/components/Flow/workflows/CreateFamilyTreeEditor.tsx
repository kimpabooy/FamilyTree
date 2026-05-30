import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import FamilyTreeCanvas from "../canvas/FamilyTreeCanvas";
import RelationTypeDialog from "./RelationTypeDialog";
import { useCreateFamilyFlow } from "../../../hooks/useCreateFamilyTreeEditor";
import type { Gender } from "../../../types/Enums";
import {
  applyNodeChanges,
  applyEdgeChanges,
  type NodeChange,
  type EdgeChange,
  type Connection,
  type Node,
} from "@xyflow/react";

export default function CreateFamilyTreeEditor() {
  const navigate = useNavigate();
  const {
    step,
    treeName,
    setTreeName,
    nodes,
    edges,
    saving,
    error,
    setNodes,
    setEdges,
    goToStep2,
    addPerson,
    connectPersons,
    connectPartners,
    saveAll,
  } = useCreateFamilyFlow();

  // ── Formulärstate ───────────────────────────────────────────────────────────
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState<Gender>(0);
  const [birthDate, setBirthDate] = useState("");
  const [isDeceased, setIsDeceased] = useState(false);
  const [deathDate, setDeathDate] = useState("");

  const [pendingConnection, setPendingConnection] = useState<Connection | null>(
    null,
  );

  // ── Canvas-callbacks ────────────────────────────────────────────────────────
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

  const onConnect = useCallback((params: Connection) => {
    setPendingConnection(params);
  }, []);

  // ── Formulär-handlers ───────────────────────────────────────────────────────
  const handleAddPerson = () => {
    if (!firstName.trim() || !lastName.trim()) return;
    addPerson({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      gender,
      birthDate: birthDate || null,
      deathDate: isDeceased ? deathDate || null : null,
    });
    // Återställ formuläret
    setFirstName("");
    setLastName("");
    setGender(0);
    setBirthDate("");
    setIsDeceased(false);
    setDeathDate("");
  };

  const handleSave = async () => {
    const treeId = await saveAll();
    if (treeId) navigate(`/familytree/${treeId}`);
  };

  // ── Steg 1: Namnge trädet ───────────────────────────────────────────────────
  if (step === 1) {
    return (
      <div className="create-flow-centered">
        <div className="create-flow-card">
          <h2 className="create-flow-card-heading">Skapa nytt familjeträd</h2>
          <p className="create-flow-card-subtext">
            Börja med att ge ditt träd ett namn.
          </p>
          <label className="create-flow-card-label" htmlFor="tree-name">
            Trädets namn
          </label>
          <input
            id="tree-name"
            className="flow-input"
            type="text"
            placeholder="t.ex. Familjen Andersson"
            value={treeName}
            onChange={(e) => setTreeName(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && treeName.trim() && goToStep2()
            }
          />
          <button
            className={`flow-btn ${treeName.trim() ? "flow-btn--primary" : "flow-btn--disabled"}`}
            disabled={!treeName.trim()}
            onClick={goToStep2}
          >
            Fortsätt
          </button>
        </div>
      </div>
    );
  }

  // ── Steg 2: Lägg till personer + koppla relationer ─────────────────────────
  return (
    <div className="create-flow-workspace">
      {pendingConnection && (
        <RelationTypeDialog
          onParentChild={() => {
            connectPersons(
              pendingConnection.source!,
              pendingConnection.target!,
            );
            setPendingConnection(null);
          }}
          onPartner={() => {
            connectPartners(
              pendingConnection.source!,
              pendingConnection.target!,
            );
            setPendingConnection(null);
          }}
          onClose={() => setPendingConnection(null)}
        />
      )}

      {/* Vänster panel */}
      <aside className="create-flow-sidebar">
        <h3 className="create-flow-sidebar-heading">{treeName}</h3>

        <section>
          <p className="create-flow-sidebar-label">Lägg till person</p>

          <input
            className="flow-input"
            type="text"
            placeholder="Förnamn"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            className="flow-input"
            type="text"
            placeholder="Efternamn"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <select
            className="flow-input"
            value={gender}
            onChange={(e) => setGender(Number(e.target.value) as Gender)}
          >
            <option value={0}>Man</option>
            <option value={1}>Kvinna</option>
            <option value={2}>Annat / okänt</option>
          </select>

          {/* Födelsedatum */}
          <label className="create-flow-sidebar-field-label">
            Födelsedatum
          </label>
          <input
            className="flow-input"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />

          {/* Avliden-toggle */}
          <label className="create-flow-sidebar-toggle">
            <input
              type="checkbox"
              checked={isDeceased}
              onChange={(e) => {
                setIsDeceased(e.target.checked);
                if (!e.target.checked) setDeathDate("");
              }}
            />
            Avliden
          </label>

          {/* Dödsdatum — visas bara om "Avliden" är ikryssad */}
          {isDeceased && (
            <>
              <label className="create-flow-sidebar-field-label">
                Dödsdatum
              </label>
              <input
                className="flow-input"
                type="date"
                value={deathDate}
                onChange={(e) => setDeathDate(e.target.value)}
              />
            </>
          )}

          <button
            className={`flow-btn ${firstName.trim() && lastName.trim() ? "flow-btn--primary" : "flow-btn--disabled"}`}
            disabled={!firstName.trim() || !lastName.trim()}
            onClick={handleAddPerson}
            style={{ marginTop: 10 }}
          >
            + Lägg till
          </button>
        </section>

        <hr className="create-flow-sidebar-divider" />

        <p className="create-flow-sidebar-hint">
          Dra en linje mellan två noder för att välja relationstyp —
          förälder–barn eller partner.
        </p>

        <hr className="create-flow-sidebar-divider" />

        {error && <p className="create-flow-sidebar-error">{error}</p>}

        <button
          className={`flow-btn ${nodes.length > 0 ? "flow-btn--success" : "flow-btn--disabled"}`}
          disabled={nodes.length === 0 || saving}
          onClick={handleSave}
        >
          {saving ? "Sparar..." : "Spara trädet"}
        </button>
        <button
          className="flow-btn flow-btn--ghost"
          onClick={() => navigate(-1)}
        >
          Avbryt
        </button>
      </aside>

      {/* Canvas */}
      <div className="create-flow-canvas">
        <FamilyTreeCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgesDelete={() => {
            // Kanterna hanteras via onConnect och onEdgesDelete, så vi ignorerar onEdgesChange
            // Vi låter användaren ta bort kanter för att ångra relationer, men vi behöver inte göra något mer än att ta bort kanten i datan.
            // Behöver koppla bort relationen i backend.
          }}
        />
      </div>
    </div>
  );
}
