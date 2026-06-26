import { useEffect, useState } from 'react';
import './App.css';

type ApiStatus = 'loading' | 'online' | 'offline';

function App() {
  const [status, setStatus] = useState<ApiStatus>('loading');

  const checkHealth = async () => {
    setStatus('loading');
    try {
      const response = await fetch('http://localhost:3001/health');
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'ok') {
          setStatus('online');
          return;
        }
      }
      setStatus('offline');
    } catch (error) {
      setStatus('offline');
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="container">
      <h1>FlowPay - Phase 1</h1>
      <div className="status-card">
        <p>Status da API:</p>
        <div className={`status-badge ${status}`}>
          {status === 'loading' && 'Carregando... 🔄'}
          {status === 'online' && 'API Online ✅'}
          {status === 'offline' && 'API Offline ❌'}
        </div>
      </div>
      <button onClick={checkHealth} disabled={status === 'loading'} className="btn-retry">
        Verificar Novamente
      </button>
    </div>
  );
}

export default App;
