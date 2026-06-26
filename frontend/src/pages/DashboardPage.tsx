import { useMemo } from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import Sidebar from '../components/Sidebar';
import SummaryCard from '../components/SummaryCard';
import TeamCard from '../components/TeamCard';
import StatusBadge from '../components/StatusBadge';
import LoadingErrorState, { ErrorBanner } from '../components/LoadingErrorState';
import { Attendance } from '../types/api';
import './DashboardPage.css';

export default function DashboardPage() {
  const { dashboard, teams, loading, error, refetch } = useDashboardData(3000);

  const hasData = !!(dashboard && teams);

  // Extrai e unifica todos os atendimentos ativos e em fila para a tabela "Atendimentos em andamento"
  const currentAttendances = useMemo(() => {
    if (!teams) return [];

    const list: Attendance[] = [];

    teams.teams.forEach(team => {
      // Ativos nos agentes
      team.agents.forEach(agent => {
        if (agent.activeAttendances) {
          list.push(...agent.activeAttendances);
        }
      });

      // Em fila no time
      if (team.queue) {
        list.push(...team.queue);
      }
    });

    // Ordena por data de criação decrescente (mais recente primeiro)
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [teams]);

  // Função auxiliar para obter o nome do time pelo id
  const getTeamName = (teamId: string) => {
    if (!teams) return teamId;
    const team = teams.teams.find(t => t.id === teamId);
    return team ? team.name : teamId;
  };

  // Função auxiliar para obter o nome do atendente pelo id
  const getAgentName = (teamId: string, agentId: string | null) => {
    if (!agentId || !teams) return '-';
    const team = teams.teams.find(t => t.id === teamId);
    if (!team) return '-';
    const agent = team.agents.find(a => a.id === agentId);
    return agent ? agent.name : '-';
  };

  if (loading && !hasData) {
    return <LoadingErrorState loading={loading} error={error} hasData={hasData} onRetry={refetch} />;
  }

  if (error && !hasData) {
    return <LoadingErrorState loading={loading} error={error} hasData={hasData} onRetry={refetch} />;
  }

  // Se chegou aqui, temos dados (hasData === true)
  const summary = dashboard?.summary || { totalActive: 0, totalQueued: 0, totalFinished: 0 };
  const teamsList = teams?.teams || [];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      
      <main className="dashboard-main">
        {error && <ErrorBanner error={error} onRetry={refetch} />}

        <header className="dashboard-header">
          <div className="header-info">
            <h1 className="dashboard-title">Dashboard de Atendimentos</h1>
            <p className="dashboard-subtitle">Visão geral em tempo real da operação</p>
          </div>
          <div className="header-actions">
            <button className="btn-refresh" onClick={refetch} disabled={loading}>
              {loading ? 'Atualizando... 🔄' : 'Atualizar agora 🔄'}
            </button>
          </div>
        </header>

        {/* Cards de Métricas */}
        <section className="metrics-grid">
          <SummaryCard
            title="Ativos"
            value={summary.totalActive}
            icon="📈"
            type="active"
          />
          <SummaryCard
            title="Em Fila"
            value={summary.totalQueued}
            icon="⏱️"
            type="queued"
          />
          <SummaryCard
            title="Finalizados"
            value={summary.totalFinished}
            icon="✅"
            type="finished"
          />
        </section>

        {/* Grade de Times */}
        <section className="teams-grid">
          {teamsList.map(team => (
            <TeamCard key={team.id} team={team} />
          ))}
        </section>

        {/* Tabela de Atendimentos Atuais */}
        <section className="recent-attendances-section">
          <h2 className="section-title">Atendimentos em andamento</h2>
          <div className="table-responsive">
            <table className="attendances-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Assunto</th>
                  <th>Time</th>
                  <th>Atendente</th>
                  <th>Início</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentAttendances.map(att => {
                  const startTime = new Date(att.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  return (
                    <tr key={att.id}>
                      <td className="customer-name-cell">
                        <div className="avatar-small">
                          {att.customerName.substring(0, 2).toUpperCase()}
                        </div>
                        <span>{att.customerName}</span>
                      </td>
                      <td>{att.subject}</td>
                      <td>
                        <span className="team-badge-inline">{getTeamName(att.teamId)}</span>
                      </td>
                      <td className="agent-cell">{getAgentName(att.teamId, att.agentId)}</td>
                      <td>{startTime}</td>
                      <td>
                        <StatusBadge status={att.status} />
                      </td>
                    </tr>
                  );
                })}
                {currentAttendances.length === 0 && (
                  <tr>
                    <td colSpan={6} className="table-empty-state">
                      Nenhum atendimento ativo ou em fila no momento.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
