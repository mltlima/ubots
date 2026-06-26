import { TeamData } from '../types/api';

interface TeamCardProps {
  team: TeamData;
}

export default function TeamCard({ team }: TeamCardProps) {
  const getProgressPercentage = (count: number) => {
    return Math.min((count / 3) * 100, 100);
  };

  const getLoadColorClass = (count: number) => {
    if (count >= 3) return 'progress-bar-danger'; // Limite máximo
    if (count === 2) return 'progress-bar-warning'; // Carga média
    return 'progress-bar-success'; // Pouca ou nenhuma carga
  };

  // Retornar um emoji de status para o atendente
  const getAgentStatusDot = (count: number) => {
    if (count === 3) return '🔴';
    if (count > 0) return '🟡';
    return '🟢';
  };

  return (
    <div className="team-card">
      <div className="team-card-header">
        <div className="team-info">
          <span className="team-dot"></span>
          <h3 className="team-name">{team.name}</h3>
        </div>
        <div className="agent-count-badge">
          👥 {team.agents.length} atendente{team.agents.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="team-card-section">
        <h4 className="section-title">Atendentes</h4>
        <div className="agents-list">
          {team.agents.map(agent => (
            <div key={agent.id} className="agent-item">
              <div className="agent-name-wrapper">
                <span className="agent-status-dot">{getAgentStatusDot(agent.activeCount)}</span>
                <span className="agent-name">{agent.name}</span>
              </div>
              <div className="agent-load-wrapper">
                <div className="progress-container">
                  <div
                    className={`progress-bar ${getLoadColorClass(agent.activeCount)}`}
                    style={{ width: `${getProgressPercentage(agent.activeCount)}%` }}
                  ></div>
                </div>
                <span className="agent-load-text">{agent.activeCount}/3</span>
              </div>
            </div>
          ))}
          {team.agents.length === 0 && (
            <p className="empty-text">Nenhum atendente cadastrado.</p>
          )}
        </div>
      </div>

      <div className="team-card-section queue-section">
        <div className="section-header-row">
          <h4 className="section-title">Fila (FIFO)</h4>
          <span className="queue-badge">{team.queue.length}</span>
        </div>
        <div className="queue-list">
          {team.queue.map((item, index) => {
            const formattedTime = new Date(item.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });
            return (
              <div key={item.id} className="queue-item">
                <div className="queue-position">{index + 1}</div>
                <div className="queue-info">
                  <span className="queue-customer">{item.customerName}</span>
                  <span className="queue-subject">{item.subject}</span>
                </div>
                <span className="queue-time">{formattedTime}</span>
              </div>
            );
          })}
          {team.queue.length === 0 && (
            <div className="empty-queue">
              <p>Nenhum atendimento aguardando</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
