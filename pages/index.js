import { useState } from 'react';

export default function Home() {
  const [rawData, setRawData] = useState('');
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const logLines = [
    'Initializing request...',
    'Reading pasted session data...',
    'Validating token format...',
    'Connecting to GoPay API...',
    'Sending secure request...',
    'Waiting for Midtrans response...',
    'Generating redirect link...',
    'Opening payment page...'
  ];

  async function generateLink() {
    setError('');
    setResult('');

    if (!rawData.trim()) {
      setError('Please paste your long session code first.');
      return;
    }

    setLoading(true);
    setLogs([]);

    for (let i = 0; i < logLines.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      setLogs((old) => [...old, logLines[i]]);
    }

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw_data: rawData })
      });

      const data = await response.json();

      if (data.url) {
        setResult(data.url);
        window.open(data.url, '_blank');
      } else {
        setError(data.error || data.message || 'Failed to generate GoPay link.');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function pasteFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      setRawData(text);
    } catch (err) {
      setError('Clipboard permission denied. Please paste manually.');
    }
  }

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <h1 style={styles.title}>GoPay / Midtrans Link Generator</h1>
        <p style={styles.subtitle}>Paste your long session code, generate the GoPay link, and open it automatically.</p>

        <div style={styles.actions}>
          <a href="https://chatgpt.com/api/auth/session" target="_blank" rel="noreferrer" style={styles.secondaryButton}>Open Session Page</a>
          <button type="button" onClick={pasteFromClipboard} style={styles.secondaryButton}>Paste Clipboard</button>
        </div>

        <textarea
          value={rawData}
          onChange={(e) => setRawData(e.target.value)}
          placeholder="Paste your long session code here..."
          style={styles.textarea}
        />

        <button type="button" onClick={generateLink} disabled={loading} style={styles.mainButton}>
          {loading ? 'Generating...' : 'Generate & Open Link'}
        </button>

        {logs.length > 0 && (
          <div style={styles.logs}>
            {logs.map((line, index) => <div key={index}>➜ {line}</div>)}
          </div>
        )}

        {result && (
          <div style={styles.result}>
            <strong>Generated Link:</strong>
            <a href={result} target="_blank" rel="noreferrer" style={styles.link}>{result}</a>
          </div>
        )}

        {error && <div style={styles.error}>{error}</div>}
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #020617, #1d4ed8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    fontFamily: 'Arial, sans-serif'
  },
  card: {
    width: '100%',
    maxWidth: 720,
    background: '#ffffff',
    borderRadius: 24,
    padding: 24,
    boxShadow: '0 20px 50px rgba(0,0,0,0.25)'
  },
  title: { textAlign: 'center', margin: 0, color: '#0f172a', fontSize: 28 },
  subtitle: { textAlign: 'center', color: '#475569', fontSize: 15 },
  actions: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 18 },
  secondaryButton: {
    display: 'block',
    textAlign: 'center',
    padding: '12px 10px',
    borderRadius: 12,
    border: '1px solid #cbd5e1',
    background: '#f8fafc',
    color: '#0f172a',
    textDecoration: 'none',
    fontWeight: 700,
    cursor: 'pointer'
  },
  textarea: {
    width: '100%',
    height: 220,
    marginTop: 16,
    padding: 14,
    borderRadius: 14,
    border: '1px solid #cbd5e1',
    fontSize: 14,
    resize: 'vertical',
    boxSizing: 'border-box'
  },
  mainButton: {
    width: '100%',
    marginTop: 14,
    padding: 16,
    border: 'none',
    borderRadius: 14,
    background: '#2563eb',
    color: '#fff',
    fontSize: 17,
    fontWeight: 800,
    cursor: 'pointer'
  },
  logs: {
    marginTop: 16,
    background: '#020617',
    color: '#22c55e',
    padding: 14,
    borderRadius: 14,
    fontFamily: 'monospace',
    fontSize: 13,
    lineHeight: 1.7
  },
  result: {
    marginTop: 16,
    background: '#f1f5f9',
    color: '#0f172a',
    padding: 14,
    borderRadius: 14,
    wordBreak: 'break-all'
  },
  link: { display: 'block', marginTop: 8, color: '#2563eb', fontWeight: 700 },
  error: {
    marginTop: 16,
    background: '#fee2e2',
    color: '#991b1b',
    padding: 14,
    borderRadius: 14,
    fontWeight: 700
  }
};
