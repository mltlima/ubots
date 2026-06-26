import { useEffect, useState, useRef, useCallback } from 'react';
import { DashboardResponse, TeamsResponse } from '../types/api';
import { fetchDashboard, fetchTeams } from '../services/api';

interface DashboardDataState {
  dashboard: DashboardResponse | null;
  teams: TeamsResponse | null;
  loading: boolean;
  error: Error | null;
}

export function useDashboardData(pollingIntervalMs = 3000) {
  const [state, setState] = useState<DashboardDataState>({
    dashboard: null,
    teams: null,
    loading: true,
    error: null,
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  const loadData = useCallback(async (isInitial = false) => {
    if (isInitial) {
      setState(prev => ({ ...prev, loading: true, error: null }));
    }

    try {
      const [dashboardRes, teamsRes] = await Promise.all([
        fetchDashboard(),
        fetchTeams(),
      ]);

      setState({
        dashboard: dashboardRes,
        teams: teamsRes,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err : new Error('Erro desconhecido'),
      }));
    }
  }, []);

  useEffect(() => {
    // Carregamento inicial imediato
    loadData(true);

    const intervalId = setInterval(() => {
      loadData(false);
    }, pollingIntervalMs);

    return () => {
      clearInterval(intervalId);
    };
  }, [loadData, pollingIntervalMs]);

  const refetch = useCallback(() => {
    loadData(true);
  }, [loadData]);

  return {
    ...state,
    refetch,
  };
}
