export type AttendanceStatus = 'ACTIVE' | 'QUEUED' | 'FINISHED';

export interface Attendance {
  id: string;
  customerName: string;
  subject: string;
  teamId: string;
  agentId: string | null;
  status: AttendanceStatus;
  createdAt: string;
  finishedAt: string | null;
}

export interface TeamAgent {
  id: string;
  name: string;
  activeCount: number;
  activeAttendances: Attendance[];
}

export interface TeamData {
  id: string;
  name: string;
  subjects: string[];
  activeCount: number;
  queuedCount: number;
  agents: TeamAgent[];
  queue: Attendance[];
}

export interface TeamsResponse {
  teams: TeamData[];
}

export interface DashboardSummary {
  totalActive: number;
  totalQueued: number;
  totalFinished: number;
}

export interface DashboardTeam {
  teamId: string;
  teamName: string;
  activeCount: number;
  queuedCount: number;
  finishedCount: number;
  agents: {
    id: string;
    name: string;
    activeAttendances: number;
  }[];
}

export interface DashboardResponse {
  summary: DashboardSummary;
  teams: DashboardTeam[];
}
