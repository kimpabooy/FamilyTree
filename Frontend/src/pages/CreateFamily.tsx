import CreateFamilyFlow from "../components/Flow/workflows/CreateFamilyTreeEditor";
import Button from "../components/Ui/Button";
import { Navigate, useNavigate } from "react-router-dom";
import { isLoggedIn } from "../services/AuthService";

export default function CreateFamily() {
  const navigate = useNavigate();

  if (!isLoggedIn()) {
    return <Navigate to="/Login" replace />;
  }

  return (
    <div className="create-family-page">
      <Button
        label="Tillbaka"
        variant="secondary"
        onClick={() => navigate("/familytree")}
      />
      <CreateFamilyFlow />
    </div>
  );
}
