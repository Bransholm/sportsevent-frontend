import React, { useEffect, useState } from "react";

interface Discipline {
  name: string;
}

interface Arena {
  name: string;
  type: string;
  shape: string;
  surface: string;
  length: number;
  lanes: number;
  disciplines: Discipline[];
}

const Arenas: React.FC = () => {
  const [arenas, setArenas] = useState<Arena[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/arenas")
      .then((response) => response.json())
      .then((data) => setArenas(data))
      .catch((error) => console.error("Error fetching arenas:", error));
  }, []);

  return (
    <div>
      <h1>Arenas</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {arenas.map((arena, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              padding: "20px",
              width: "300px",
            }}
          >
            <h2>{arena.name}</h2>
            <table>
              <tbody>
                <tr>
                  <td>
                    <strong>Type:</strong>
                  </td>
                  <td>{arena.type}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Shape:</strong>
                  </td>
                  <td>{arena.shape}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Surface:</strong>
                  </td>
                  <td>{arena.surface}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Length:</strong>
                  </td>
                  <td>{arena.length} meters</td>
                </tr>
                <tr>
                  <td>
                    <strong>Lanes:</strong>
                  </td>
                  <td>{arena.lanes}</td>
                </tr>
              </tbody>
            </table>
            <h3>Disciplines:</h3>
            <ul>
              {arena.disciplines.map((discipline, index) => (
                <li key={index}>{discipline.name}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Arenas;
