export interface Driver {
  id: string;
  name: string;
  team: string;
  number: number;
  color: string;
}

export interface TelemetryData {
  driver_id: string;
  timestamp: number;
  position: {
    lat: number;
    lng: number;
  };
  speed: number;
  throttle: number;
  brake: number;
  steering: number;
  gear: number;
  rpm: number;
  lap_time?: number;
  sector: number;
}

export interface RaceSession {
  id: string;
  name: string;
  circuit: string;
  date: string;
  status: 'live' | 'completed' | 'upcoming';
  drivers: Driver[];
  lap_count?: number;
  duration?: string;
}

export interface LeaderboardEntry {
  position: number;
  driver: Driver;
  lap_time: number;
  gap: number;
  last_lap: number;
  best_lap: number;
  laps_completed: number;
}

export interface DriverAnalysis {
  driver_id: string;
  session_id: string;
  braking_points: Array<{
    lat: number;
    lng: number;
    intensity: number;
  }>;
  throttle_control: Array<{
    timestamp: number;
    throttle: number;
  }>;
  corner_speeds: Array<{
    corner: string;
    speed: number;
  }>;
  speed_map: Array<{
    lat: number;
    lng: number;
    speed: number;
  }>;
}

export interface DriverComparison {
  session_id: string;
  driver1: {
    id: string;
    avg_lap_time: number;
    best_lap_time: number;
    top_speed: number;
    avg_speed: number;
    consistency: number;
  };
  driver2: {
    id: string;
    avg_lap_time: number;
    best_lap_time: number;
    top_speed: number;
    avg_speed: number;
    consistency: number;
  };
}

export interface LiveTelemetry {
  type: string;
  session_id: string;
  timestamp: string;
  drivers: Array<{
    driver_id: string;
    position: {
      lat: number;
      lng: number;
    };
    speed: number;
    throttle: number;
    brake: number;
    lap: number;
    sector: number;
  }>;
}

export interface CircuitPoint {
  lat: number;
  lng: number;
  name: string;
}

export interface Circuit {
  points: CircuitPoint[];
} 