export default function Home() {
  return (
    <div className="home-page">
      <section className="home-hero-section">
        <h1>Family Tree</h1>
        <p>
          Bygg ditt släktträd och upptäck historierna som format din familj
          genom generationer. Utforska människorna, platserna och minnena som
          gjort din släkt unik. Samla bilder, berättelser och relationer på ett
          och samma ställe, och bevara familjens historia för framtida
          generationer på ett enkelt, modernt och interaktivt sätt.
        </p>
      </section>

      <section className="home-features-section">
        <h2>Vad du kan göra?</h2>
        <div className="home-features-container">
          <div className="home-feature">
            <h3>Bygg ditt träd</h3>
            <p>Lägg till familjemedlemmar och relationer enkelt i det interaktiva trädet.</p>
          </div>

          <div className="home-feature">
            <h3>Säkra historien</h3>
            <p>Se till att dina familjehistorier sparas säkert för framtida generationer.</p>
          </div>

          <div className="home-feature">
            <h3>Dela och upptäck</h3>
            <p>Utforska dina släktband och samarbeta med familjen.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
