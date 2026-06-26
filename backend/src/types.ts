export enum AttendanceStatus {
  ACTIVE = 'ACTIVE',
  QUEUED = 'QUEUED',
  FINISHED = 'FINISHED'
}

export interface Team {
  id: string;
  name: string;
  subjects: string[];
  isDefault: boolean;
}

export interface Agent {
  id: string;
  name: string;
  teamId: string;
}

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
