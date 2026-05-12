import { useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/router';
import { auth, googleProvider } from '../lib/firebaseClient';

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (user) router.push('/');
    });
  }, [router]);

  async function loginWithGoogle() {
    await signInWithPopup(auth, googleProvider);
    router.push('/');
  }

  return (
    <main style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#020617,#1d4ed8)',fontFamily:'Arial',padding:20}}>
      <section style={{background:'#fff',borderRadius:20,padding:25,width:'100%',maxWidth:420,textAlign:'center'}}>
        <h1>Login</h1>
        <p>Continue with Google to use GoPay Generator.</p>
        <button onClick={loginWithGoogle} style={{width:'100%',padding:15,border:'none',borderRadius:12,background:'#111827',color:'#fff',fontSize:17,fontWeight:800}}>Continue with Google</button>
      </section>
    </main>
  );
}
