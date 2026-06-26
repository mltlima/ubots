import { DashboardResponse, TeamsResponse } from '../types/api';

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
