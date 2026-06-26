import { DashboardResponse, TeamsResponse, Attendance } from '../types/api';

const API_BASE_URL = 'http://localhost:3001';

export async function fetchDashboard(): Promise<DashboardResponse> {
  const response = await fetch(`${API_BASE_URL}/dashboard`);
  if (!response.ok) {
    throw new Error('Falha ao buscar dados do dashboard');
  }
  return response.json();
}

export async function fetchTeams(): Promise<TeamsResponse> {
  const response = await fetch(`${API_BASE_URL}/teams`);
  if (!response.ok) {
    throw new Error('Falha ao buscar dados dos times');
  }
  return response.json();
}

export interface CreateAttendancePayload {
  customerName: string;
  subject: string;
}

export async function createAttendance(payload: CreateAttendancePayload): Promise<Attendance> {
  const response = await fetch(`${API_BASE_URL}/attendances`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Falha ao criar atendimento');
  }
  
  const data = await response.json();
  return data.attendance;
}

export async function finishAttendance(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/attendances/${id}/finish`, {
    method: 'POST',
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Falha ao finalizar atendimento');
  }
}

