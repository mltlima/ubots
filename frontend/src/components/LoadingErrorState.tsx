interface LoadingErrorStateProps {
  loading: boolean;
  error: Error | null;
  hasData: boolean;
  onRetry: () => void;
}

export function FullPageLoading() {
  return (
    <div className="full-page-state">
      <div className="spinner"></div>
      <p>Carregando dados do dashboard...</p>
    </div>
  );
}

export function FullPageError({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <div className="full-page-state error-state">
      <div className="error-icon">⚠️</div>
      <h2>Ops! Ocorreu um erro</h2>
      <p>{error.message || 'Não foi possível conectar ao servidor.'}</p>
      <p className="error-subtext">Verifique se o backend está rodando em http://localhost:3001</p>
      <button className="btn-retry" onClick={onRetry}>
        Tentar Novamente
      </button>
    </div>
  );
}

export function ErrorBanner({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <div className="error-banner">
      <div className="error-banner-content">
        <span className="error-banner-icon">⚠️</span>
        <span>Conexão perdida ({error.message}). Exibindo dados desatualizados.</span>
      </div>
      <button className="btn-banner-retry" onClick={onRetry}>
        Reconectar
      </button>
    </div>
  );
}

export default function LoadingErrorState({
  loading,
  error,
  hasData,
  onRetry,
}: LoadingErrorStateProps) {
  if (loading && !hasData) {
    return <FullPageLoading />;
  }

  if (error && !hasData) {
    return <FullPageError error={error} onRetry={onRetry} />;
  }

  return null;
}
