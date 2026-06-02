import { useCallback, useState } from "react";
import {
  applyNodeChanges,
  type NodeChange,
  type Connection,
  type Node,
} from "@xyflow/react";
import { useForm } from "react-hook-form";
import FamilyTreeCanvas from "../canvas/FamilyTreeCanvas";
import RelationTypeDialog from "../workflows/RelationTypeDialog";
import { useFamilyTreeView } from "../../../hooks/useFamilyTreeView";
import { updatePerson, createPerson } from "../../../services/PersonService";
import type { Person } from "../../../types/Models";
import type { UpdatePersonRequest } from "../../../types/Requests";
import { Gender } from "../../../types/Enums";

interface FamilyTreeEditViewProps {
  familyTreeId: number;
  addPersonPanelOpen?: boolean;
  onAddPersonPanelClose?: () => void;
}

// ── Formulärtyper ────────────────────────────────────────────────────────────

interface PersonFormData {
  firstName: string;
  lastName: string;
  gender: number;
  birthDate: string;
  isDeceased: boolean;
  deathDate: string;
}

// ── Delad formulärsektion ─────────────────────────────────────────────────────

function PersonFormFields({
  register,
  errors,
  watchIsDeceased,
}: {
  register: ReturnType<typeof useForm<PersonFormData>>["register"];
  errors: ReturnType<typeof useForm<PersonFormData>>["formState"]["errors"];
  watchIsDeceased: boolean;
}) {
  return (
    <>
      <label className="edit-panel-field-label">Förnamn</label>
      <input
        className={`flow-input ${errors.firstName ? "flow-input--error" : ""}`}
        {...register("firstName", { required: "Krävs" })}
      />
      {errors.firstName && (
        <span className="auth-form-error">{errors.firstName.message}</span>
      )}

      <label className="edit-panel-field-label">Efternamn</label>
      <input
        className={`flow-input ${errors.lastName ? "flow-input--error" : ""}`}
        {...register("lastName", { required: "Krävs" })}
      />
      {errors.lastName && (
        <span className="auth-form-error">{errors.lastName.message}</span>
      )}

      <label className="edit-panel-field-label">Kön</label>
      <select
        className="flow-input"
        {...register("gender", { valueAsNumber: true })}
      >
        <option value={0}>Man</option>
        <option value={1}>Kvinna</option>
        <option value={2}>Annat / okänt</option>
      </select>

      <label className="edit-panel-field-label">Födelsedatum</label>
      <input className="flow-input" type="date" {...register("birthDate")} />

      <label className="create-flow-sidebar-toggle">
        <input type="checkbox" {...register("isDeceased")} />
        Avliden
      </label>

      {watchIsDeceased && (
        <>
          <label className="edit-panel-field-label">Dödsdatum</label>
          <input
            className="flow-input"
            type="date"
            {...register("deathDate")}
          />
        </>
      )}
    </>
  );
}

// ── Huvudkomponent ────────────────────────────────────────────────────────────

export default function FamilyTreeEditView({
  familyTreeId,
  addPersonPanelOpen = false,
  onAddPersonPanelClose,
}: FamilyTreeEditViewProps) {
  const {
    nodes,
    edges,
    loading,
    error,
    setNodes,
    addParentChildEdge,
    addPartnerEdge,
    removeEdge,
    updatePersonLocally,
  } = useFamilyTreeView(familyTreeId, false);

  const [pendingConnection, setPendingConnection] = useState<Connection | null>(
    null,
  );
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // ── Formulär: redigera befintlig person ─────────────────────────────────────
  const editForm = useForm<PersonFormData>();
  const watchEditDeceased = editForm.watch("isDeceased");

  // ── Formulär: lägg till ny person ───────────────────────────────────────────
  const addForm = useForm<PersonFormData>({
    defaultValues: { gender: 0, isDeceased: false },
  });
  const watchAddDeceased = addForm.watch("isDeceased");

  // ── Klick på nod → öppna edit-panel ─────────────────────────────────────────
  const onNodeClick = useCallback(
    (nodeId: string) => {
      const node = nodes.find((n) => n.id === nodeId);
      const person = node?.data?.person as Person | undefined;
      if (!person) return;

      setSelectedPerson(person);
      setSaveError(null);
      editForm.reset({
        firstName: person.firstName,
        lastName: person.lastName,
        gender: person.gender,
        birthDate: person.birthDate
          ? new Date(person.birthDate).toISOString().split("T")[0]
          : "",
        isDeceased: person.deathDate !== null,
        deathDate: person.deathDate
          ? new Date(person.deathDate).toISOString().split("T")[0]
          : "",
      });
    },
    [nodes, editForm],
  );

  // ── Spara redigerad person ───────────────────────────────────────────────────
  const onEditSubmit = async (data: PersonFormData) => {
    if (!selectedPerson) return;
    setSaving(true);
    setSaveError(null);
    try {
      const req: UpdatePersonRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender as Gender,
        birthDate: data.birthDate || null,
        deathDate: data.isDeceased ? data.deathDate || null : null,
        profileImageUrl: selectedPerson.profileImageUrl,
      };
      const updated = await updatePerson(selectedPerson.id, req);
      updatePersonLocally(updated);
      setSelectedPerson(updated);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Kunde inte spara");
    } finally {
      setSaving(false);
    }
  };

  // ── Lägg till ny person ──────────────────────────────────────────────────────
  const onAddSubmit = async (data: PersonFormData) => {
    setSaving(true);
    setSaveError(null);
    try {
      const created = await createPerson({
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender as Gender,
        birthDate: data.birthDate || null,
        deathDate: data.isDeceased ? data.deathDate || null : null,
        profileImageUrl: null, // TODO: stöd för profilbild
        familyTreeId,
      });
      // Lägg till noden lokalt i trädet utan att ladda om hela sidan
      updatePersonLocally(created);
      addForm.reset({ gender: 0, isDeceased: false });
      onAddPersonPanelClose?.();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Kunde inte spara");
    } finally {
      setSaving(false);
    }
  };

  // ── Canvas-callbacks ─────────────────────────────────────────────────────────
  const onNodesChange = useCallback(
    (changes: NodeChange<Node>[]) =>
      setNodes((prev) => applyNodeChanges(changes, prev)),
    [setNodes],
  );
  const onEdgesChange = useCallback(() => {}, []);
  const onConnect = useCallback(
    (params: Connection) => setPendingConnection(params),
    [],
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
    <div style={{ display: "flex", height: "100%", width: "100%" }}>
      {pendingConnection && (
        <RelationTypeDialog
          onParentChild={async () => {
            await addParentChildEdge(
              Number(pendingConnection.source),
              Number(pendingConnection.target),
            );
            setPendingConnection(null);
          }}
          onPartner={async () => {
            try {
              await addPartnerEdge(
                Number(pendingConnection.source),
                Number(pendingConnection.target),
              );
            } catch (err) {
              console.error("Kunde inte skapa partnerrelation:", err);
            } finally {
              setPendingConnection(null);
            }
          }}
          onClose={() => setPendingConnection(null)}
        />
      )}

      {/* Canvas */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <FamilyTreeCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgesDelete={onEdgesDelete}
          onNodeClick={onNodeClick}
          readOnly={false}
        />
      </div>

      {/* ── Panel: Lägg till ny person ── */}
      {addPersonPanelOpen && (
        <aside className="edit-panel">
          <div className="edit-panel-header">
            <h3 className="edit-panel-heading">Lägg till person</h3>
            <button
              className="edit-panel-close"
              onClick={onAddPersonPanelClose}
              aria-label="Stäng"
            >
              ×
            </button>
          </div>

          <form
            className="edit-panel-body"
            onSubmit={addForm.handleSubmit(onAddSubmit)}
            id="add-person-form"
          >
            <PersonFormFields
              register={addForm.register}
              errors={addForm.formState.errors}
              watchIsDeceased={watchAddDeceased}
            />
            {saveError && (
              <p className="auth-form-error" style={{ marginTop: 8 }}>
                {saveError}
              </p>
            )}
          </form>

          <div className="edit-panel-actions">
            <button
              type="submit"
              form="add-person-form"
              className="flow-btn flow-btn--primary"
              disabled={saving}
            >
              {saving ? "Sparar..." : "+ Lägg till"}
            </button>
            <button
              className="flow-btn flow-btn--ghost"
              onClick={onAddPersonPanelClose}
            >
              Avbryt
            </button>
          </div>
        </aside>
      )}

      {/* ── Panel: Redigera befintlig person ── */}
      {selectedPerson && !addPersonPanelOpen && (
        <aside className="edit-panel">
          <div className="edit-panel-header">
            <h3 className="edit-panel-heading">
              {selectedPerson.firstName} {selectedPerson.lastName}
            </h3>
            <button
              className="edit-panel-close"
              onClick={() => setSelectedPerson(null)}
              aria-label="Stäng"
            >
              ×
            </button>
          </div>

          <form
            className="edit-panel-body"
            onSubmit={editForm.handleSubmit(onEditSubmit)}
            id="person-edit-form"
          >
            <PersonFormFields
              register={editForm.register}
              errors={editForm.formState.errors}
              watchIsDeceased={watchEditDeceased}
            />
            {saveError && (
              <p className="auth-form-error" style={{ marginTop: 8 }}>
                {saveError}
              </p>
            )}
          </form>

          <div className="edit-panel-actions">
            <button
              type="submit"
              form="person-edit-form"
              className="flow-btn flow-btn--primary"
              disabled={saving}
            >
              {saving ? "Sparar..." : "Spara ändringar"}
            </button>
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
