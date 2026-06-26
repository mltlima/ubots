import { randomUUID } from 'crypto';
import { Attendance, AttendanceStatus, Team, Agent } from '../types';
import { initialTeams, initialAgents } from '../data/initialData';

const MAX_ACTIVE_PER_AGENT = 3;

// In-memory data store
const teams: Team[] = [...initialTeams];
const agents: Agent[] = [...initialAgents];
const attendances: Attendance[] = [];

export function createAttendance(customerName: string, subject: string): Attendance {
  const cleanCustomerName = customerName.trim();
  const cleanSubject = subject.trim();

  if (!cleanCustomerName || !cleanSubject) {
    throw new Error('customerName and subject are required');
  }

  // Find team by subject (case-insensitive)
  const subjectLower = cleanSubject.toLowerCase();
  let matchedTeam = teams.find(t =>
    t.subjects.some(subj => subj.toLowerCase() === subjectLower)
  );

  // If no team matches, route to default team
  if (!matchedTeam) {
    matchedTeam = teams.find(t => t.isDefault) || teams[0];
  }

  // Find agents belonging to the matched team
  const teamAgents = agents.filter(a => a.teamId === matchedTeam!.id);

  // Find agent with the lowest number of active attendances (must be < 3)
  let chosenAgent: Agent | null = null;
  let minActiveCount = MAX_ACTIVE_PER_AGENT;

  for (const agent of teamAgents) {
    const activeCount = attendances.filter(
      att => att.agentId === agent.id && att.status === AttendanceStatus.ACTIVE
    ).length;

    if (activeCount < minActiveCount) {
      minActiveCount = activeCount;
      chosenAgent = agent;
    }
  }

  const status = chosenAgent ? AttendanceStatus.ACTIVE : AttendanceStatus.QUEUED;
  const agentId = chosenAgent ? chosenAgent.id : null;

  const newAttendance: Attendance = {
    id: randomUUID(),
    customerName: cleanCustomerName,
    subject: cleanSubject,
    teamId: matchedTeam.id,
    agentId,
    status,
    createdAt: new Date().toISOString(),
    finishedAt: null
  };

  attendances.push(newAttendance);
  return newAttendance;
}

export function finishAttendance(id: string): { finished: Attendance; promoted: Attendance | null } {
  const attendance = attendances.find(att => att.id === id);

  if (!attendance) {
    throw new Error('Attendance not found');
  }

  if (attendance.status !== AttendanceStatus.ACTIVE) {
    throw new Error('Only active attendances can be finished');
  }

  // Finish attendance
  attendance.status = AttendanceStatus.FINISHED;
  attendance.finishedAt = new Date().toISOString();

  const releasedAgentId = attendance.agentId;
  const teamId = attendance.teamId;

  // Check if there is queue in the same team
  // Find first queued attendance for this team, respecting insertion order
  const promotedAttendance = attendances.find(
    att => att.teamId === teamId && att.status === AttendanceStatus.QUEUED
  );

  if (promotedAttendance && releasedAgentId) {
    promotedAttendance.agentId = releasedAgentId;
    promotedAttendance.status = AttendanceStatus.ACTIVE;
  }

  return {
    finished: attendance,
    promoted: promotedAttendance || null
  };
}

export function getTeams() {
  return teams.map(team => {
    const teamAgents = agents.filter(a => a.teamId === team.id);
    
    const mappedAgents = teamAgents.map(agent => {
      const activeAtts = attendances.filter(
        att => att.agentId === agent.id && att.status === AttendanceStatus.ACTIVE
      );
      return {
        id: agent.id,
        name: agent.name,
        activeCount: activeAtts.length,
        activeAttendances: activeAtts
      };
    });

    const activeCount = attendances.filter(
      att => att.teamId === team.id && att.status === AttendanceStatus.ACTIVE
    ).length;

    const queue = attendances.filter(
      att => att.teamId === team.id && att.status === AttendanceStatus.QUEUED
    );

    return {
      id: team.id,
      name: team.name,
      subjects: team.subjects,
      activeCount,
      queuedCount: queue.length,
      agents: mappedAgents,
      queue
    };
  });
}

export function getDashboard() {
  const totalActive = attendances.filter(att => att.status === AttendanceStatus.ACTIVE).length;
  const totalQueued = attendances.filter(att => att.status === AttendanceStatus.QUEUED).length;
  const totalFinished = attendances.filter(att => att.status === AttendanceStatus.FINISHED).length;

  const teamsSummary = teams.map(team => {
    const teamAgents = agents.filter(a => a.teamId === team.id);

    const activeCount = attendances.filter(
      att => att.teamId === team.id && att.status === AttendanceStatus.ACTIVE
    ).length;
    const queuedCount = attendances.filter(
      att => att.teamId === team.id && att.status === AttendanceStatus.QUEUED
    ).length;
    const finishedCount = attendances.filter(
      att => att.teamId === team.id && att.status === AttendanceStatus.FINISHED
    ).length;

    const mappedAgents = teamAgents.map(agent => {
      const activeCountForAgent = attendances.filter(
        att => att.agentId === agent.id && att.status === AttendanceStatus.ACTIVE
      ).length;
      return {
        id: agent.id,
        name: agent.name,
        activeAttendances: activeCountForAgent
      };
    });

    return {
      teamId: team.id,
      teamName: team.name,
      activeCount,
      queuedCount,
      finishedCount,
      agents: mappedAgents
    };
  });

  return {
    summary: {
      totalActive,
      totalQueued,
      totalFinished
    },
    teams: teamsSummary
  };
}
