import TestApiEndpoint from "../components/TestApiEndpoint";

export default function Home() {
  return (
    <div className="home-page">
      <h1>Home</h1>
      <h2>Family Tree</h2>
      <p>Bevara familjehistoria för framtida generationer.</p>
      <p>Skapa och utforska ditt släktträd enkelt och intuitivt.</p>
      <TestApiEndpoint />
    </div>

  );
}
