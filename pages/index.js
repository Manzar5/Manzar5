import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebaseClient';

export default function Home() {
  const [user, setUser] = useState(null);
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

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <div style={styles.badge}>Secure Access</div>
        <h1 style={styles.title}>GoPay / Midtrans Generator</h1>
        <p style={styles.subtitle}>Continue with Google to create your account and get 2 free credits.</p>

        {!user ? (
          <button onClick={login} style={styles.loginButton}>Continue with Google</button>
        ) : (
          <div style={styles.userBox}>
            <b>Login Successful</b><br />
            {user.email}<br />
            <b>Free Credits:</b> 2<br />
            <a href="/dashboard" style={styles.openButton}>Open Dashboard</a>
            <button onClick={logout} style={styles.logoutButton}>Logout</button>
          </div>
        )}

        {error && <div style={styles.error}>{error}</div>}
      </section>
    </main>
  );
}

const styles = {
  page: { minHeight: '100vh', background: 'linear-gradient(135deg,#020617,#1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: 'Arial' },
  card: { width: '100%', maxWidth: 460, background: '#fff', borderRadius: 24, padding: 28, boxShadow: '0 20px 50px rgba(0,0,0,.28)', textAlign: 'center' },
  badge: { display: 'inline-block', background: '#dbeafe', color: '#1d4ed8', padding: '7px 12px', borderRadius: 999, fontWeight: 800, fontSize: 13, marginBottom: 14 },
  title: { margin: 0, color: '#0f172a', fontSize: 28, lineHeight: 1.2 },
  subtitle: { color: '#475569', marginTop: 12, marginBottom: 20, lineHeight: 1.6 },
  loginButton: { width: '100%', padding: 16, borderRadius: 14, border: 'none', background: '#111827', color: '#fff', fontSize: 18, fontWeight: 800, cursor: 'pointer' },
  userBox: { marginTop: 16, background: '#ecfdf5', color: '#065f46', padding: 16, borderRadius: 14, lineHeight: 1.9, fontWeight: 700 },
  openButton: { display: 'block', marginTop: 12, padding: 12, borderRadius: 12, background: '#2563eb', color: '#fff', textDecoration: 'none' },
  logoutButton: { width: '100%', marginTop: 10, padding: 12, border: 'none', borderRadius: 12, background: '#ef4444', color: '#fff', fontWeight: 800, cursor: 'pointer' },
  error: { marginTop: 16, background: '#fee2e2', color: '#991b1b', padding: 14, borderRadius: 14, fontWeight: 700, textAlign: 'left' }
};
