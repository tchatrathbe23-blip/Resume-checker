import { useState } from 'react';
import './App.css';

function App() {
  const [resume, setResume] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!resume.trim()) {
      alert("Please paste a resume first.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume }),
      });
      const data = await response.json();
      setFeedback(data.result);
    } catch (err) {
      setFeedback("❌ Error analyzing resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>📄 Resume Analyzer</h1>
      <textarea
        value={resume}
        onChange={(e) => setResume(e.target.value)}
        placeholder="Paste your resume here..."
      />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>
      <div className="feedback">
        <h3>Feedback:</h3>
        <p>{feedback}</p>
      </div>
    </div>
  );
}

export default App;