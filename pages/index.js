import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebaseClient';

export default function Home() {
  const [user, setUser] = useState(null);
  const [rawData, setRawData] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
  }, []);

  async function login() {
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      setError(e.message || 'Google login failed');
    }
  }

  async function logout() {
    await signOut(auth);
  }

  async function pasteClipboard() {
    try {
      setRawData(await navigator.clipboard.readText());
    } catch (e) {
      setError('Clipboard permission denied');
    }
  }

  async function generateLink() {
    if (!user) return setError('Please login with Google first.');
    if (!rawData.trim()) return setError('Please paste your session code first.');
    alert('Logged in system is working. Next step: credits and admin panel.');
  }

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <h1 style={styles.title}>GoPay / Midtrans Link Generator</h1>
        <p style={styles.subtitle}>Login with Google first to use this tool.</p>

        {!user ? (
          <button onClick={login} style={styles.loginButton}>Continue with Google</button>
        ) : (
          <div style={styles.userBox}>
            <b>Logged in:</b> {user.email}<br />
            <b>Free Credits:</b> 2<br />
            <button onClick={logout} style={styles.logoutButton}>Logout</button>
          </div>
        )}

        <div style={styles.actions}>
          <button onClick={pasteClipboard} style={styles.secondaryButton}>Paste Clipboard</button>
          <a href="/users" style={styles.secondaryButton}>User Manager</a>
        </div>

        <textarea
          value={rawData}
          onChange={(e) => setRawData(e.target.value)}
          placeholder="Paste your session code here..."
          style={styles.textarea}
        />

        <button onClick={generateLink} style={styles.mainButton}>Generate & Open Link</button>
        {error && <div style={styles.error}>{error}</div>}
      </section>
    </main>
  );
}

const styles = {
  page: { minHeight: '100vh', background: 'linear-gradient(135deg,#020617,#1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: 'Arial' },
  card: { width: '100%', maxWidth: 720, background: '#fff', borderRadius: 24, padding: 24, boxShadow: '0 20px 50px rgba(0,0,0,.25)' },
  title: { textAlign: 'center', margin: 0, color: '#0f172a', fontSize: 28 },
  subtitle: { textAlign: 'center', color: '#475569' },
  loginButton: { width: '100%', padding: 16, borderRadius: 14, border: 'none', background: '#111827', color: '#fff', fontSize: 18, fontWeight: 800 },
  userBox: { marginTop: 16, background: '#ecfdf5', color: '#065f46', padding: 14, borderRadius: 14, lineHeight: 1.8 },
  logoutButton: { marginTop: 8, padding: 10, border: 'none', borderRadius: 10, background: '#ef4444', color: '#fff' },
  actions: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16 },
  secondaryButton: { textAlign: 'center', padding: 12, borderRadius: 12, border: '1px solid #cbd5e1', background: '#f8fafc', color: '#0f172a', textDecoration: 'none', fontWeight: 700 },
  textarea: { width: '100%', height: 220, marginTop: 16, padding: 14, borderRadius: 14, border: '1px solid #cbd5e1', boxSizing: 'border-box' },
  mainButton: { width: '100%', marginTop: 14, padding: 16, border: 'none', borderRadius: 14, background: '#2563eb', color: '#fff', fontSize: 17, fontWeight: 800 },
  error: { marginTop: 16, background: '#fee2e2', color: '#991b1b', padding: 14, borderRadius: 14, fontWeight: 700 }
};
