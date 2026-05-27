import { useNavigate } from "react-router-dom";
import FamilyFlow from "../components/Flow/FamilyFlow";
import Button from "../components/Ui/Button";

// TODO: Byt ut hårdkodat id mot dynamisk routing, t.ex. useParams()
// när du har en träd-väljar-sida eller hämtar inloggrad användares träd.
const FAMILY_TREE_ID = 2;

export default function FamilyTreePage() {
  const navigate = useNavigate();

  return (
    <div className="familytree-page">
      <div className="familytree-page-toolbar">
        <Button
          label="Skapa nytt familjeträd"
          variant="primary"
          onClick={() => navigate("/familytree/new")}
        />
        <Button
          label="Uppdatera trädet"
          variant="secondary"
          onClick={() => navigate(`/familytree/${FAMILY_TREE_ID}/update`)}
        />
        <Button
          label="Ta bort trädet"
          variant="danger"
          onClick={() => navigate("/")}
        />
      </div>
      <div className="familytree-page-canvas">
        <FamilyFlow familyTreeId={FAMILY_TREE_ID} />
      </div>
    </div>
  );
}
