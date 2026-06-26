import { Team, Agent } from '../types';

export const initialTeams: Team[] = [
  {
    id: 'team-cards',
    name: 'Time Cartões',
    subjects: ['Problemas com cartão'],
    isDefault: false
  },
  {
    id: 'team-loans',
    name: 'Time Empréstimos',
    subjects: ['Contratação de empréstimo'],
    isDefault: false
  },
  {
    id: 'team-others',
    name: 'Time Outros Assuntos',
    subjects: [],
    isDefault: true
  }
];

export const initialAgents: Agent[] = [
  // Time Cartões
  { id: 'agent-ana', name: 'Ana', teamId: 'team-cards' },
  { id: 'agent-bruno', name: 'Bruno', teamId: 'team-cards' },
  { id: 'agent-carlos', name: 'Carlos', teamId: 'team-cards' },
  // Time Empréstimos
  { id: 'agent-diana', name: 'Diana', teamId: 'team-loans' },
  { id: 'agent-eduardo', name: 'Eduardo', teamId: 'team-loans' },
  // Time Outros Assuntos
  { id: 'agent-fernanda', name: 'Fernanda', teamId: 'team-others' },
  { id: 'agent-gabriel', name: 'Gabriel', teamId: 'team-others' }
];
