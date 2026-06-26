/**
 * FlowPay — Script de Seed / Dados de Demonstração
 *
 * Popula o backend com atendimentos de exemplo para facilitar a avaliação.
 *
 * Uso:
 *   cd backend
 *   npm run seed
 *
 * Requisitos:
 *   - Backend rodando em http://localhost:3001
 *   - Node.js 18+ (usa fetch nativo)
 *
 * IMPORTANTE:
 *   - Este script é opcional e não é idempotente.
 *   - Para rodar novamente do zero, reinicie o backend antes.
 *   - Não altera regras de negócio nem o frontend.
 */

const BASE_URL = 'http://localhost:3001';

interface AttendanceResponse {
  id: string;
  customerName: string;
  subject: string;
  teamId: string;
  agentId: string | null;
  status: string;
}

interface TeamAgent {
  id: string;
  name: string;
  activeCount: number;
  activeAttendances: AttendanceResponse[];
}

interface TeamResponse {
  id: string;
  name: string;
  activeCount: number;
  queuedCount: number;
  agents: TeamAgent[];
}

// ── Dados de demonstração ───────────────────────────────────────────

const seedData: { customerName: string; subject: string }[] = [
  // Time Cartões — 11 atendimentos ("Problemas com cartão")
  // Capacidade: 3 agentes × 3 = 9 ativos → fila de 2
  { customerName: 'Cliente Cartão 01', subject: 'Problemas com cartão' },
  { customerName: 'Cliente Cartão 02', subject: 'Problemas com cartão' },
  { customerName: 'Cliente Cartão 03', subject: 'Problemas com cartão' },
  { customerName: 'Cliente Cartão 04', subject: 'Problemas com cartão' },
  { customerName: 'Cliente Cartão 05', subject: 'Problemas com cartão' },
  { customerName: 'Cliente Cartão 06', subject: 'Problemas com cartão' },
  { customerName: 'Cliente Cartão 07', subject: 'Problemas com cartão' },
  { customerName: 'Cliente Cartão 08', subject: 'Problemas com cartão' },
  { customerName: 'Cliente Cartão 09', subject: 'Problemas com cartão' },
  { customerName: 'Cliente Cartão 10', subject: 'Problemas com cartão' },
  { customerName: 'Cliente Cartão 11', subject: 'Problemas com cartão' },

  // Time Empréstimos — 7 atendimentos ("Contratação de empréstimo")
  // Capacidade: 2 agentes × 3 = 6 ativos → fila de 1
  { customerName: 'Cliente Empréstimo 01', subject: 'Contratação de empréstimo' },
  { customerName: 'Cliente Empréstimo 02', subject: 'Contratação de empréstimo' },
  { customerName: 'Cliente Empréstimo 03', subject: 'Contratação de empréstimo' },
  { customerName: 'Cliente Empréstimo 04', subject: 'Contratação de empréstimo' },
  { customerName: 'Cliente Empréstimo 05', subject: 'Contratação de empréstimo' },
  { customerName: 'Cliente Empréstimo 06', subject: 'Contratação de empréstimo' },
  { customerName: 'Cliente Empréstimo 07', subject: 'Contratação de empréstimo' },

  // Time Outros Assuntos — 4 atendimentos ("Dúvida geral")
  // Capacidade: 2 agentes × 3 = 6 ativos → sem fila
  { customerName: 'Cliente Outros 01', subject: 'Dúvida geral' },
  { customerName: 'Cliente Outros 02', subject: 'Dúvida geral' },
  { customerName: 'Cliente Outros 03', subject: 'Dúvida geral' },
  { customerName: 'Cliente Outros 04', subject: 'Dúvida geral' },
];

// ── Funções auxiliares ──────────────────────────────────────────────

async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/health`);
    return res.ok;
  } catch {
    return false;
  }
}

async function createAttendance(customerName: string, subject: string): Promise<AttendanceResponse> {
  const res = await fetch(`${BASE_URL}/attendances`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customerName, subject }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Falha ao criar atendimento: ${res.status} — ${error}`);
  }

  const data = await res.json();
  return data.attendance;
}

async function finishAttendance(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/attendances/${id}/finish`, {
    method: 'POST',
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Falha ao finalizar atendimento: ${res.status} — ${error}`);
  }
}

async function getTeams(): Promise<TeamResponse[]> {
  const res = await fetch(`${BASE_URL}/teams`);

  if (!res.ok) {
    throw new Error(`Falha ao buscar times: ${res.status}`);
  }

  const data = await res.json();
  return data.teams;
}

// ── Execução principal ──────────────────────────────────────────────

async function main() {
  console.log('');
  console.log('🌱 FlowPay — Seed de Demonstração');
  console.log('──────────────────────────────────');

  // 1. Verificar se o backend está rodando
  const isHealthy = await checkBackendHealth();
  if (!isHealthy) {
    console.error('');
    console.error('❌ Backend não está rodando em ' + BASE_URL);
    console.error('   Inicie o backend primeiro: cd backend && npm run dev');
    console.error('');
    process.exit(1);
  }

  // 2. Criar atendimentos sequencialmente (respeitar FIFO)
  console.log('');
  console.log('📋 Criando atendimentos...');

  for (const data of seedData) {
    const att = await createAttendance(data.customerName, data.subject);
    const statusIcon = att.status === 'ACTIVE' ? '✓' : '⏳';
    console.log(`   ${statusIcon} ${att.customerName} → ${att.status}`);
  }

  // 3. Buscar times para capturar um ID ativo de Cartões
  const teamsAfterCreate = await getTeams();
  const cardsTeam = teamsAfterCreate.find(t => t.id === 'team-cards');

  if (!cardsTeam) {
    console.error('❌ Time Cartões não encontrado');
    process.exit(1);
  }

  // Pegar o primeiro atendimento ativo de qualquer agente do Time Cartões
  let activeAttendanceId: string | null = null;
  for (const agent of cardsTeam.agents) {
    if (agent.activeAttendances.length > 0) {
      activeAttendanceId = agent.activeAttendances[0].id;
      break;
    }
  }

  if (!activeAttendanceId) {
    console.error('❌ Nenhum atendimento ativo encontrado no Time Cartões');
    process.exit(1);
  }

  // 4. Finalizar 1 atendimento ativo
  console.log('');
  console.log('🏁 Finalizando 1 atendimento do Time Cartões...');
  await finishAttendance(activeAttendanceId);
  console.log('   ✓ Atendimento finalizado (promoção automática da fila)');

  // 5. Buscar estado final para resumo
  const teamsAfterFinish = await getTeams();

  // Montar resumo
  console.log('');
  console.log('──────────────────────────────────');
  console.log('✅ Atendimentos criados: ' + seedData.length);

  for (const team of teamsAfterFinish) {
    const queueLabel = team.queuedCount > 0 ? `fila: ${team.queuedCount}` : 'fila: 0';
    console.log(`   • ${team.name}: ativos: ${team.activeCount}, ${queueLabel}`);
  }

  const totalFinished = seedData.length - teamsAfterFinish.reduce((sum, t) => sum + t.activeCount + t.queuedCount, 0);
  console.log('✅ Atendimentos finalizados: ' + totalFinished);

  const teamsWithQueue = teamsAfterFinish.filter(t => t.queuedCount > 0);
  console.log('✅ Times com fila: ' + teamsWithQueue.map(t => t.name).join(', '));

  console.log('──────────────────────────────────');
  console.log('');
  console.log('🖥️  Abra o frontend: http://localhost:5173');
  console.log('');
}

main().catch((err) => {
  console.error('');
  console.error('❌ Erro inesperado:', err.message);
  process.exit(1);
});
