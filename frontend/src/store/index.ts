import { create } from 'zustand';
import { Driver, RaceSession, LiveTelemetry } from '../types';

interface F1Store {
  // State
  drivers: Driver[];
  sessions: RaceSession[];
  currentSession: RaceSession | null;
  selectedDriver: Driver | null;
  liveTelemetry: LiveTelemetry | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setDrivers: (drivers: Driver[]) => void;
  setSessions: (sessions: RaceSession[]) => void;
  setCurrentSession: (session: RaceSession | null) => void;
  setSelectedDriver: (driver: Driver | null) => void;
  setLiveTelemetry: (telemetry: LiveTelemetry | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Computed
  getDriverById: (id: string) => Driver | undefined;
  getSessionById: (id: string) => RaceSession | undefined;
}

export const useF1Store = create<F1Store>((set, get) => ({
  // Initial state
  drivers: [],
  sessions: [],
  currentSession: null,
  selectedDriver: null,
  liveTelemetry: null,
  isLoading: false,
  error: null,
  
  // Actions
  setDrivers: (drivers) => set({ drivers }),
  setSessions: (sessions) => set({ sessions }),
  setCurrentSession: (session) => set({ currentSession: session }),
  setSelectedDriver: (driver) => set({ selectedDriver: driver }),
  setLiveTelemetry: (telemetry) => set({ liveTelemetry: telemetry }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  
  // Computed
  getDriverById: (id) => get().drivers.find(driver => driver.id === id),
  getSessionById: (id) => get().sessions.find(session => session.id === id),
})); 