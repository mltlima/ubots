import { AttendanceStatus } from '../types/api';

interface StatusBadgeProps {
  status: AttendanceStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getBadgeClass = () => {
    switch (status) {
      case 'ACTIVE':
        return 'badge-active';
      case 'QUEUED':
        return 'badge-queued';
      case 'FINISHED':
        return 'badge-finished';
      default:
        return '';
    }
  };

  const getBadgeLabel = () => {
    switch (status) {
      case 'ACTIVE':
        return 'Ativo';
      case 'QUEUED':
        return 'Em Fila';
      case 'FINISHED':
        return 'Finalizado';
      default:
        return status;
    }
  };

  return <span className={`status-badge ${getBadgeClass()}`}>{getBadgeLabel()}</span>;
}
