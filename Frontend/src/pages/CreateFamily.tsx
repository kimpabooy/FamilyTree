import { Navigate, useNavigate } from "react-router-dom";
import { isLoggedIn } from "../services/AuthService";
import CreateFamilyFlow from "../components/Flow/workflows/CreateFamilyTreeEditor";
import Button from "../components/Ui/Button";

export default function CreateFamily() {
  const navigate = useNavigate();

  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  return (
    // familytree-page ger flex-column + height: 100% — samma som edit-sidan
    <div className="familytree-page">
      <div className="familytree-page-toolbar">
        <Button
          label="← Tillbaka"
          variant="secondary"
          onClick={() => navigate("/familytree")}
        />
      </div>
      <div className="familytree-page-canvas">
        <CreateFamilyFlow />
      </div>
    </div>
  );
}
