interface SummaryCardProps {
  title: string;
  value: number;
  icon: string;
  type: 'active' | 'queued' | 'finished';
}

export default function SummaryCard({ title, value, icon, type }: SummaryCardProps) {
  const getCardClass = () => {
    switch (type) {
      case 'active':
        return 'summary-card-active';
      case 'queued':
        return 'summary-card-queued';
      case 'finished':
        return 'summary-card-finished';
      default:
        return '';
    }
  };

  const getSubtext = () => {
    switch (type) {
      case 'active':
        return 'atendimentos em andamento';
      case 'queued':
        return 'aguardando atendimento';
      case 'finished':
        return 'atendimentos concluídos';
      default:
        return '';
    }
  };

  return (
    <div className={`summary-card ${getCardClass()}`}>
      <div className="summary-card-header">
        <span className="summary-card-title">{title}</span>
        <span className="summary-card-icon">{icon}</span>
      </div>
      <div className="summary-card-body">
        <span className="summary-card-value">{value}</span>
        <span className="summary-card-subtext">{getSubtext()}</span>
      </div>
    </div>
  );
}
