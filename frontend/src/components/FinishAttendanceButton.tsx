import { useState } from 'react';
import { finishAttendance } from '../services/api';

interface FinishAttendanceButtonProps {
  attendanceId: string;
  onSuccess: () => void;
}

export default function FinishAttendanceButton({ attendanceId, onSuccess }: FinishAttendanceButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFinish = async () => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      await finishAttendance(attendanceId);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao finalizar');
      // Auto-clear error after 3 seconds so it doesn't stay stuck forever in the UI
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="finish-btn-wrapper">
      <button
        onClick={handleFinish}
        disabled={loading}
        className="btn-finish"
        title="Finalizar atendimento"
      >
        {loading ? '...' : 'Finalizar ✓'}
      </button>
      {error && <span className="finish-error-tooltip">{error}</span>}
    </div>
  );
}
