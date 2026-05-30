interface RelationTypeDialogProps {
  onParentChild: () => void;
  onPartner: () => void;
  //   onSibling: () => void;
  onClose: () => void;
}

/**
 * RelationTypeDialog — visas när användaren drar en linje mellan två noder.
 * Låter användaren välja om det är en förälder-barn- eller partnerrelation.
 */
export default function RelationTypeDialog({
  onParentChild,
  onPartner,
  onClose,
}: RelationTypeDialogProps) {
  return (
    <div className="dialog-overlay">
      <div className="dialog-card">
        <h3 className="dialog-card-heading">Vilken typ av relation?</h3>
        <p className="dialog-card-text">
          Välj hur dessa två personer är kopplade till varandra.
        </p>
        <div className="dialog-card-actions">
          <button
            className="flow-btn flow-btn--primary"
            onClick={onParentChild}
          >
            1. Förälder → Barn
          </button>
          <button className="flow-btn flow-btn--primary" onClick={onPartner}>
            2. Partner
          </button>
          <button className="flow-btn flow-btn--ghost" onClick={onClose}>
            Avbryt
          </button>
        </div>
      </div>
    </div>
  );
}
