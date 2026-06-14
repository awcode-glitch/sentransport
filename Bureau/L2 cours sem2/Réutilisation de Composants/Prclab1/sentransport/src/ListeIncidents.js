import { useState, useEffect } from 'react';
import './ListeIncidents.css';

function ListeIncidents() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/incidents")
      .then(r => r.json())
      .then(data => setIncidents(data))
      .catch(err => console.error("Erreur incidents:", err));
  }, []);

  if (incidents.length === 0) {
    return (
      <div className="liste-incidents">
        <h2 className="incidents-titre">Incidents signalés</h2>
        <p className="incidents-vide">Aucun incident signalé.</p>
      </div>
    );
  }

  return (
    <div className="liste-incidents">
      <h2 className="incidents-titre">Incidents signalés</h2>
      <ul className="incidents-liste">
        {incidents.map(i => (
          <li key={i.id} className="incident-item">
            <span className="incident-ligne">Ligne {i.ligne}</span>
            <span className="incident-desc">{i.description}</span>
            <span className="incident-lieu">{i.lieu}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListeIncidents;