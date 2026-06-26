import { describe, it, expect, beforeEach } from 'vitest';
import {
  createAttendance,
  finishAttendance,
  getTeams,
  getDashboard,
  resetState
} from '../services/attendanceService';
import { AttendanceStatus } from '../types';

describe('attendanceService', () => {
  beforeEach(() => {
    resetState();
  });

  describe('Routing by subject', () => {
    it('should route "Problemas com cartão" to Time Cartões (team-cards)', () => {
      const att = createAttendance('John Doe', 'Problemas com cartão');
      expect(att.teamId).toBe('team-cards');
    });

    it('should route "Contratação de empréstimo" to Time Empréstimos (team-loans)', () => {
      const att = createAttendance('Jane Doe', 'Contratação de empréstimo');
      expect(att.teamId).toBe('team-loans');
    });

    it('should route unknown subjects to Time Outros Assuntos (team-others)', () => {
      const att = createAttendance('Bob Smith', 'Pix não caiu');
      expect(att.teamId).toBe('team-others');
    });

    it('should be case-insensitive for subjects in uppercase', () => {
      const att = createAttendance('Alice', 'PROBLEMAS COM CARTÃO');
      expect(att.teamId).toBe('team-cards');
    });

    it('should be case-insensitive for subjects in lowercase', () => {
      const att = createAttendance('Charlie', 'problemas com cartão');
      expect(att.teamId).toBe('team-cards');
    });
  });

  describe('Agent distribution by workload', () => {
    it('should assign a new attendance to one of the team agents', () => {
      const att = createAttendance('John', 'Problemas com cartão');
      expect(att.agentId).not.toBeNull();
      expect(['agent-ana', 'agent-bruno', 'agent-carlos']).toContain(att.agentId);
      expect(att.status).toBe(AttendanceStatus.ACTIVE);
    });

    it('should distribute attendances to the agent with the lowest load', () => {
      // First 3 attendances will go to the 3 agents in team-cards (each gets 1)
      const att1 = createAttendance('Client 1', 'Problemas com cartão');
      const att2 = createAttendance('Client 2', 'Problemas com cartão');
      const att3 = createAttendance('Client 3', 'Problemas com cartão');

      const agentsAssigned = [att1.agentId, att2.agentId, att3.agentId];
      // All 3 agents should be different
      expect(new Set(agentsAssigned).size).toBe(3);

      // 4th attendance should go to the one with the lowest load (which is now 1 for all of them, so it picks one)
      const att4 = createAttendance('Client 4', 'Problemas com cartão');
      expect(agentsAssigned).toContain(att4.agentId);
    });
  });

  describe('Capacity constraints (Max 3 active per agent)', () => {
    it('should restrict each agent to maximum of 3 active attendances', () => {
      // 3 agents * 3 max = 9 active attendances for team-cards
      for (let i = 0; i < 9; i++) {
        const att = createAttendance(`Client ${i}`, 'Problemas com cartão');
        expect(att.status).toBe(AttendanceStatus.ACTIVE);
        expect(att.agentId).not.toBeNull();
      }

      // The 10th one must be QUEUED
      const att10 = createAttendance('Client 10', 'Problemas com cartão');
      expect(att10.status).toBe(AttendanceStatus.QUEUED);
      expect(att10.agentId).toBeNull();
    });

    it('should queue the attendance with null agentId when all agents are full', () => {
      // team-loans has 2 agents: Diana and Eduardo. Total capacity = 6.
      for (let i = 0; i < 6; i++) {
        createAttendance(`Loan Client ${i}`, 'Contratação de empréstimo');
      }
      const queuedAtt = createAttendance('Queued Client', 'Contratação de empréstimo');
      expect(queuedAtt.status).toBe(AttendanceStatus.QUEUED);
      expect(queuedAtt.agentId).toBeNull();
    });
  });

  describe('Queue ordering (FIFO)', () => {
    it('should maintain FIFO order for queued attendances', () => {
      // Fill team-loans (6 capacity)
      for (let i = 0; i < 6; i++) {
        createAttendance(`Client ${i}`, 'Contratação de empréstimo');
      }

      // Create 3 queued attendances
      const q1 = createAttendance('Queue 1', 'Contratação de empréstimo');
      const q2 = createAttendance('Queue 2', 'Contratação de empréstimo');
      const q3 = createAttendance('Queue 3', 'Contratação de empréstimo');

      const teamsData = getTeams();
      const loansTeam = teamsData.find(t => t.id === 'team-loans');
      expect(loansTeam?.queuedCount).toBe(3);
      expect(loansTeam?.queue[0].id).toBe(q1.id);
      expect(loansTeam?.queue[1].id).toBe(q2.id);
      expect(loansTeam?.queue[2].id).toBe(q3.id);
    });
  });

  describe('Finishing attendances and promotion from queue', () => {
    it('should finish an active attendance, changing status to FINISHED and setting finishedAt', () => {
      const att = createAttendance('Client', 'Problemas com cartão');
      const { finished } = finishAttendance(att.id);

      expect(finished.status).toBe(AttendanceStatus.FINISHED);
      expect(finished.finishedAt).not.toBeNull();
      expect(Date.parse(finished.finishedAt!)).not.toBeNaN();
    });

    it('should promote the first queued attendance to ACTIVE when an active attendance is finished', () => {
      // Fill team-loans (6 capacity)
      const actives: any[] = [];
      for (let i = 0; i < 6; i++) {
        actives.push(createAttendance(`Active Client ${i}`, 'Contratação de empréstimo'));
      }

      // Queue 1
      const queued = createAttendance('Queued Client', 'Contratação de empréstimo');

      // Finish one active. Let's finish actives[0]
      const releasedAgentId = actives[0].agentId;
      const { finished, promoted } = finishAttendance(actives[0].id);

      expect(finished.id).toBe(actives[0].id);
      expect(finished.status).toBe(AttendanceStatus.FINISHED);

      expect(promoted).not.toBeNull();
      expect(promoted!.id).toBe(queued.id);
      expect(promoted!.status).toBe(AttendanceStatus.ACTIVE);
      expect(promoted!.agentId).toBe(releasedAgentId);
    });

    it('should promote in FIFO order when multiple are queued', () => {
      // Fill team-loans (6 capacity)
      const actives: any[] = [];
      for (let i = 0; i < 6; i++) {
        actives.push(createAttendance(`Active Client ${i}`, 'Contratação de empréstimo'));
      }

      // Queue 2 clients
      const q1 = createAttendance('Queue 1', 'Contratação de empréstimo');
      const q2 = createAttendance('Queue 2', 'Contratação de empréstimo');

      // Finish one active
      const releasedAgentId = actives[0].agentId;
      const { promoted: p1 } = finishAttendance(actives[0].id);
      expect(p1!.id).toBe(q1.id);
      expect(p1!.status).toBe(AttendanceStatus.ACTIVE);
      expect(p1!.agentId).toBe(releasedAgentId);

      // The next queue item should be q2
      const teamsData = getTeams();
      const loansTeam = teamsData.find(t => t.id === 'team-loans');
      expect(loansTeam?.queue[0].id).toBe(q2.id);
      expect(loansTeam?.queuedCount).toBe(1);
    });

    it('should return promoted as null if there are no attendances in queue', () => {
      const att = createAttendance('Client', 'Problemas com cartão');
      const { promoted } = finishAttendance(att.id);
      expect(promoted).toBeNull();
    });
  });

  describe('Validation and Edge Case Errors', () => {
    it('should throw error when attempting to finish a queued attendance', () => {
      // Fill team-loans (6 capacity)
      for (let i = 0; i < 6; i++) {
        createAttendance(`Client ${i}`, 'Contratação de empréstimo');
      }
      const queued = createAttendance('Queued Client', 'Contratação de empréstimo');

      expect(() => finishAttendance(queued.id)).toThrow('Only active attendances can be finished');
    });

    it('should throw error when attempting to finish a finished attendance', () => {
      const att = createAttendance('Client', 'Problemas com cartão');
      finishAttendance(att.id);

      expect(() => finishAttendance(att.id)).toThrow('Only active attendances can be finished');
    });

    it('should throw error when attempting to finish a non-existent attendance ID', () => {
      expect(() => finishAttendance('invalid-uuid')).toThrow('Attendance not found');
    });

    it('should throw error if customerName is empty or only spaces', () => {
      expect(() => createAttendance('', 'Problemas com cartão')).toThrow('customerName and subject are required');
      expect(() => createAttendance('   ', 'Problemas com cartão')).toThrow('customerName and subject are required');
    });

    it('should throw error if subject is empty or only spaces', () => {
      expect(() => createAttendance('John Doe', '')).toThrow('customerName and subject are required');
      expect(() => createAttendance('John Doe', '   ')).toThrow('customerName and subject are required');
    });
  });

  describe('getTeams and overall counts', () => {
    it('should reflect accurate active and queued counts on teams info', () => {
      createAttendance('C1', 'Problemas com cartão');
      createAttendance('C2', 'Problemas com cartão');
      createAttendance('C3', 'Contratação de empréstimo');
      const unknown = createAttendance('C4', 'Outro assunto aleatório');

      const teamsData = getTeams();
      
      const cards = teamsData.find(t => t.id === 'team-cards');
      expect(cards?.activeCount).toBe(2);
      expect(cards?.queuedCount).toBe(0);

      const loans = teamsData.find(t => t.id === 'team-loans');
      expect(loans?.activeCount).toBe(1);
      expect(loans?.queuedCount).toBe(0);

      const others = teamsData.find(t => t.id === 'team-others');
      expect(others?.activeCount).toBe(1);
      expect(others?.queuedCount).toBe(0);

      // Finish one from others
      finishAttendance(unknown.id);
      const updatedOthers = getTeams().find(t => t.id === 'team-others');
      expect(updatedOthers?.activeCount).toBe(0);
    });
  });
});
