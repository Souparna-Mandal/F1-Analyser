import axios from 'axios';
import { 
  Driver, 
  RaceSession, 
  TelemetryData, 
  LeaderboardEntry, 
  DriverAnalysis, 
  DriverComparison,
  Circuit 
} from '../types';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Drivers
export const getDrivers = async (): Promise<Driver[]> => {
  const response = await api.get('/api/drivers');
  return response.data;
};

export const getDriver = async (driverId: string): Promise<Driver> => {
  const response = await api.get(`/api/drivers/${driverId}`);
  return response.data;
};

// Sessions
export const getSessions = async (): Promise<RaceSession[]> => {
  const response = await api.get('/api/sessions');
  return response.data;
};

export const getSession = async (sessionId: string): Promise<RaceSession> => {
  const response = await api.get(`/api/sessions/${sessionId}`);
  return response.data;
};

// Telemetry
export const getTelemetry = async (
  sessionId: string, 
  driverId: string, 
  lap?: number
): Promise<TelemetryData[]> => {
  const params = lap ? { lap } : {};
  const response = await api.get(`/api/telemetry/${sessionId}/${driverId}`, { params });
  return response.data;
};

// Leaderboard
export const getLeaderboard = async (sessionId: string): Promise<LeaderboardEntry[]> => {
  const response = await api.get(`/api/leaderboard/${sessionId}`);
  return response.data;
};

// Analysis
export const getDriverAnalysis = async (
  sessionId: string, 
  driverId: string
): Promise<DriverAnalysis> => {
  const response = await api.get(`/api/analysis/${sessionId}/${driverId}`);
  return response.data;
};

// Comparison
export const getDriverComparison = async (
  sessionId: string, 
  driver1: string, 
  driver2: string
): Promise<DriverComparison> => {
  const response = await api.get(`/api/comparison/${sessionId}`, {
    params: { driver1, driver2 }
  });
  return response.data;
};

// Circuit
export const getCircuit = async (): Promise<Circuit> => {
  const response = await api.get('/api/circuit');
  return response.data;
};

// WebSocket connection for live data
export const createWebSocketConnection = (sessionId: string): WebSocket => {
  return new WebSocket(`ws://localhost:8000/ws/live/${sessionId}`);
};

export default api; 