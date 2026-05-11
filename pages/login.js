import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  return (
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh',fontFamily:'sans-serif'}}>
      <button onClick={loginWithGoogle} style={{padding:'14px 24px',fontSize:'18px',borderRadius:'10px',background:'#2563eb',color:'#fff',border:'none'}}>
        Continue with Google
      </button>
    </div>
  );
}
