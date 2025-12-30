import { useEffect, useState } from "react";
import "./App.css";

const STATUSES = ["Applied", "Interview", "Rejected"];

function App() {
  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem("applications");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("applications", JSON.stringify(applications));
  }, [applications]);

  function addApplication(e) {
    e.preventDefault();

    const form = e.currentTarget;
    const company = form.company.value.trim();
    const position = form.position.value.trim();
    const status = form.status.value;

    if (!company || !position) return;

    const newItem = {
      id: crypto.randomUUID(),
      company,
      position,
      status,
      createdAt: new Date().toISOString(),
    };

    setApplications((prev) => [newItem, ...prev]);
    form.reset(); // clears fields
    form.status.value = "Applied"; // keep default visible
  }

  function updateStatus(id, newStatus) {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  }

  function removeApplication(id) {
    setApplications((prev) => prev.filter((a) => a.id !== id));
  }

  function clearAll() {
    if (confirm("Clear all applications?")) setApplications([]);
  }

  return (
    <div className="jt">
      <header className="jtHeader">
        <h1>Job Application Tracker</h1>
        <p>Track applications, update status, and keep everything saved.</p>
      </header>

      <section className="jtCard">
        <h2 className="jtCardTitle">Add Application</h2>

        <form className="jtForm" onSubmit={addApplication}>
          <input name="company" type="text" placeholder="Company" required />
          <input name="position" type="text" placeholder="Position" required />

          <select name="status" defaultValue="Applied">
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button type="submit">Add</button>
        </form>
      </section>

      <section className="jtCard">
        <div className="jtRow">
          <h2 className="jtCardTitle">Applications</h2>
          <button className="jtGhost" onClick={clearAll} type="button">
            Clear all
          </button>
        </div>

        {applications.length === 0 ? (
          <p className="jtEmpty">No applications yet. Add one above.</p>
        ) : (
          <ul className="jtList">
            {applications.map((a) => (
              <li key={a.id} className="jtItem">
                <div className="jtItemMain">
                  <strong>{a.company}</strong>
                  <span className="jtMuted">— {a.position}</span>
                </div>

                <div className="jtItemActions">
                  <select
                    value={a.status}
                    onChange={(e) => updateStatus(a.id, e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>

                  <button
                    className="jtDanger"
                    onClick={() => removeApplication(a.id)}
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;
