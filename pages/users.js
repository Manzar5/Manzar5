import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function UsersPage() {
  const [rows, setRows] = useState([]);
  const [message, setMessage] = useState('Loading...');

  async function loadRows() {
    const { data, error } = await supabase
      .from('profiles')
      .select('id,email,credits,created_at')
      .order('created_at', { ascending: false });

    if (error) setMessage(error.message);
    else {
      setRows(data || []);
      setMessage('');
    }
  }

  useEffect(() => { loadRows(); }, []);

  return (
    <main style={{minHeight:'100vh',background:'#0f172a',color:'#fff',padding:20,fontFamily:'Arial'}}>
      <section style={{maxWidth:900,margin:'0 auto'}}>
        <h1>User Manager</h1>
        <p>Users and credits will appear here after Supabase table setup.</p>
        {message && <p>{message}</p>}
        {rows.map((u) => (
          <div key={u.id} style={{background:'#fff',color:'#0f172a',borderRadius:14,padding:16,marginBottom:12}}>
            <b>{u.email || 'No email'}</b>
            <p>Credits: {u.credits}</p>
            <p style={{fontSize:12,color:'#64748b'}}>ID: {u.id}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
