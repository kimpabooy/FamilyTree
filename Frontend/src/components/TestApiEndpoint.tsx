import { useState } from "react";
import { apiFetch } from "../services/Api";

export default function TestApiEndpoint() {
  const [data, setData] = useState<unknown | null>(null);
  const path = "/api/Person/tree/1";
  return (
    <>
      <h2>Test API</h2>
      <p>Testa API-anslutningen.</p>
      <button
        onClick={async () => {
          try {
            const response = await apiFetch<unknown>(path, {
              method: "GET",
            });
            console.log(response);
            setData(response);
          } catch (error) {
            console.error("Fel vid API-anrop:", error);
          }
        }}
      >
        Testa API
      </button>

      {/* show the data */}
      <div>{data !== null && <pre>{JSON.stringify(data, null, 2)}</pre>}</div>
    </>
  );
}
