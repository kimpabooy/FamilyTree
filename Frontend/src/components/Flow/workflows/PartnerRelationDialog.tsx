import { useCallback } from "react";
import { useCreateFamilyFlow } from "../../../hooks/useCreateFamilyTreeEditor";

/*
 * CreatePartnerFlow — flöde för att skapa en partnerrelation mellan två personer.
 * Används i CreateFamilyFlow när man kopplar ihop två personer som inte redan har en förälder-barn-relation.
 * Ansvarar för: hantera lokal state för partnerrelationen, skicka tillbaka den till CreateFamilyFlow när den är klar.
 */

interface CreatePartnerFlowProps {
  person1Id: string;
  person2Id: string;
  onClose: () => void;
}

export default function CreatePartnerFlow({
  person1Id,
  person2Id,
  onClose,
}: CreatePartnerFlowProps) {
  const { connectPartners } = useCreateFamilyFlow();
  const handleSave = useCallback(() => {
    connectPartners(person1Id, person2Id);
    onClose();
  }, [connectPartners, person1Id, person2Id, onClose]);

  return (
    <div
      style={{
        padding: "20px",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2>Koppla ihop personer</h2>
      <p>
        Vill du koppla ihop person {person1Id} och person {person2Id} som
        partners?
      </p>
      <button onClick={handleSave} style={{ marginRight: "10px" }}>
        Ja, koppla ihop
      </button>
      <button onClick={onClose}>Nej, avbryt</button>
    </div>
  );
}
