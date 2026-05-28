import CreateFamilyFlow from "../components/Flow/CreateFamilyFlow";
import Button from "../components/Ui/Button";
import { useNavigate } from "react-router-dom";

export default function CreateFamily() {
  const navigate = useNavigate();

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
