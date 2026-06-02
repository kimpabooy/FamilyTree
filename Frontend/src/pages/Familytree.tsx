import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FamilyTreeView from "../components/Flow/views/FamilyTreeView";
import Button from "../components/Ui/Button";
import { getFamilyTrees } from "../services/FamilytreeService";
import { getCurrentUserId } from "../services/AuthService";
import type { FamilyTree } from "../types/Models";

/**
 * FamilyTreePage — read-only vy.
 */

export default function FamilyTreePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();

  const [searchInput, setSearchInput] = useState(id ?? "");
  const [activeFamilyTreeId, setActiveId] = useState<number | null>(
    id ? Number(id) : null,
  );
  const [loadingOwn, setLoadingOwn] = useState(!id);
  const [ownTrees, setOwnTrees] = useState<FamilyTree[]>([]);

  // Hämta användarens egna träd om inget id finns i URL:en
  useEffect(() => {
    if (id) return; // URL-id har prioritet
    const userId = getCurrentUserId();
    if (!userId) {
      setLoadingOwn(false);
      return;
    }
    getFamilyTrees()
      .then((trees) => {
        const mine = trees.filter((t) => t.ownerId === userId);
        setOwnTrees(mine);
        if (mine.length > 0) setActiveId(mine[0].id);
      })
      .catch(console.error)
      .finally(() => setLoadingOwn(false));
  }, [id]);

  const handleSearch = () => {
    const parsed = Number(searchInput);
    if (parsed > 0) {
      setActiveId(parsed);
      navigate(`/familytree/${parsed}`, { replace: true });
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  const renderCanvas = () => {
    if (loadingOwn) {
      return <p style={{ padding: 24 }}>Laddar ditt familjeträd...</p>;
    }

    if (!activeFamilyTreeId) {
      // Ingen inloggad eller inga träd
      return (
        <div className="familytree-empty">
          <p className="familytree-empty-text">
            Du har inget familjeträd än. Skapa ett och börja bygga din
            familjehistoria.
          </p>
          <Button
            label="Logga in och skapa ditt första träd"
            variant="primary"
            onClick={() => navigate("/familytree/new")}
          />
        </div>
      );
    }

    return <FamilyTreeView familyTreeId={activeFamilyTreeId} />;
  };

  return (
    <div className="familytree-page">
      <div className="familytree-page-toolbar">
        <Button
          label="Skapa nytt träd"
          variant="primary"
          onClick={() => navigate("/familytree/new")}
        />
        {activeFamilyTreeId && (
          <Button
            label="Redigera trädet"
            variant="secondary"
            onClick={() => navigate(`/familytree/${activeFamilyTreeId}/edit`)}
          />
        )}
        {/* Eget träd-väljare om användaren har flera */}
        {ownTrees.length > 1 && (
          <select
            className="flow-input"
            style={{ maxWidth: 200 }}
            value={activeFamilyTreeId ?? ""}
            onChange={(e) => {
              const val = Number(e.target.value);
              setActiveId(val);
              navigate(`/familytree/${val}`, { replace: true });
            }}
          >
            {ownTrees.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        )}
        {/* Sökfält — sök på träd-ID */}
        <div className="familytree-search">
          <input
            type="number"
            placeholder="Sök träd-ID..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className="btn btn-secondary" onClick={handleSearch}>
            Sök
          </button>
        </div>
      </div>

      <div className="familytree-page-canvas">{renderCanvas()}</div>
    </div>
  );
}
