import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import BasicFlow from "./BasicFlow";
import ConnectionTypeDialog from "../Ui/ConnectionTypeDialog";
import { useCreateFamilyFlow } from "../../hooks/useCreateFamilyFlow";
import type { Gender } from "../../types/Enums";
import {
  applyNodeChanges,
  applyEdgeChanges,
  type NodeChange,
  type EdgeChange,
  type Connection,
  type Node,
} from "@xyflow/react";

export default function CreateFamilyFlow() {
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

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState<Gender>(0);
  // Håller kvar en pending koppling tills användaren valt relationstyp.
  const [pendingConnection, setPendingConnection] = useState<Connection | null>(
    null,
  );

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

  // Visa dialog istället för att direkt skapa relationen
  const onConnect = useCallback((params: Connection) => {
    setPendingConnection(params);
  }, []);

  const handleAddPerson = () => {
    if (!firstName.trim() || !lastName.trim()) return;
    addPerson({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      gender,
    });
    setFirstName("");
    setLastName("");
    setGender(0);
  };

  const handleSave = async () => {
    const treeId = await saveAll();
    if (treeId) {
      navigate(`/familytree/${treeId}`);
    }
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
      {/* Relationstyp-dialog — visas ovanpå canvas när en koppling dragits */}
      {pendingConnection && (
        <ConnectionTypeDialog
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
          //   onSibling={() => {
          //     connectPersons(pendingConnection.source!, pendingConnection.target!);
          //     connectPersons(pendingConnection.target!, pendingConnection.source!);
          //     setPendingConnection(null);
          //   }}
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
          <button
            className={`flow-btn ${firstName.trim() && lastName.trim() ? "flow-btn--primary" : "flow-btn--disabled"}`}
            disabled={!firstName.trim() || !lastName.trim()}
            onClick={handleAddPerson}
          >
            + Lägg till
          </button>
        </section>

        <hr className="create-flow-sidebar-divider" />

        <p className="create-flow-sidebar-hint">
          Dra en linje mellan två noder för att välja relationstyp —
          förälder-barn eller partner.
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
        <BasicFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgesDelete={() => {
            /* Lokala kanter — ingen backend att anropa ännu */
          }}
        />
      </div>
    </div>
  );
}
