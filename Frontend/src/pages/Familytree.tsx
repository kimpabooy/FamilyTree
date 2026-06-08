import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import FamilyTreeView from "../components/Flow/views/FamilyTreeView";
import Button from "../components/Ui/Button";
import { getFamilyTrees } from "../services/FamilytreeService";
import { getCurrentUserId } from "../services/AuthService";
import type { FamilyTree } from "../types/Models";

export default function FamilyTreePage() {
  const navigate  = useNavigate();
  const location  = useLocation(); // ← reagerar på navigation tillbaka från edit
  const { id }    = useParams<{ id?: string }>();

  const [searchInput,       setSearchInput] = useState(id ?? "");
  const [activeFamilyTreeId, setActiveId]   = useState<number | null>(id ? Number(id) : null);
  const [loadingOwn,        setLoadingOwn]  = useState(true);
  const [ownTrees,          setOwnTrees]    = useState<FamilyTree[]>([]);

  // Ladda om träd-listan varje gång sidan visas (även när man navigerar tillbaka från edit)
  useEffect(() => {
    const userId = getCurrentUserId();
    if (!userId) {
      setLoadingOwn(false);
      return;
    }

    setLoadingOwn(true);
    getFamilyTrees()
      .then((trees) => {
        const mine = trees.filter((t) => t.ownerId === userId);
        setOwnTrees(mine);

        // Sätt aktivt träd: URL-id har prioritet, annars första egna trädet
        if (id) {
          setActiveId(Number(id));
        } else if (mine.length > 0 && !activeFamilyTreeId) {
          setActiveId(mine[0].id);
        }
      })
      .catch(console.error)
      .finally(() => setLoadingOwn(false));
  // location.pathname i dep-array gör att effekten körs om varje gång
  // användaren navigerar till /familytree (t.ex. efter att ha lämnat edit-läget)
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = () => {
    const parsed = Number(searchInput);
    if (parsed > 0) {
      setActiveId(parsed);
      navigate(`/familytree/${parsed}`, { replace: true });
    }
  };

  const renderCanvas = () => {
    if (loadingOwn) {
      return <p style={{ padding: 24 }}>Laddar ditt familjeträd...</p>;
    }

    if (!activeFamilyTreeId) {
      return (
        <div className="familytree-empty">
          <p className="familytree-empty-text">
            Du har inget familjeträd än. Skapa ett och börja bygga din familjehistoria.
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
        <Button label="Skapa nytt träd" variant="primary" onClick={() => navigate("/familytree/new")} />
        {activeFamilyTreeId && (
          <Button
            label="Redigera trädet"
            variant="secondary"
            onClick={() => navigate(`/familytree/${activeFamilyTreeId}/edit`)}
          />
        )}
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
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        )}
        <div className="familytree-search">
          <input
            type="number"
            placeholder="Sök träd-ID..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className="btn btn-secondary" onClick={handleSearch}>Sök</button>
        </div>
      </div>

      <div className="familytree-page-canvas">{renderCanvas()}</div>
    </div>
  );
}