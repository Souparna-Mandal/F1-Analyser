import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useF1Store } from '../store';
import { getTelemetry, getDriverAnalysis } from '../services/api';
import { TelemetryData, DriverAnalysis } from '../types';
import { Gauge, Zap, Brake, SteeringWheel, Gauge as GaugeIcon } from 'lucide-react';

interface TelemetryDashboardProps {
  sessionId?: string;
  driverId?: string;
}

const TelemetryDashboard: React.FC<TelemetryDashboardProps> = ({ 
  sessionId = 'monaco_2024_race', 
  driverId = 'VER' 
}) => {
  const { drivers, selectedDriver, setSelectedDriver } = useF1Store();
  const [telemetry, setTelemetry] = useState<TelemetryData[]>([]);
  const [analysis, setAnalysis] = useState<DriverAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!sessionId || !driverId) return;
      
      setIsLoading(true);
      try {
        const [telemetryData, analysisData] = await Promise.all([
          getTelemetry(sessionId, driverId),
          getDriverAnalysis(sessionId, driverId)
        ]);
        setTelemetry(telemetryData);
        setAnalysis(analysisData);
      } catch (error) {
        console.error('Failed to load telemetry data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [sessionId, driverId]);

  const currentDriver = drivers.find(d => d.id === driverId) || selectedDriver;
  const latestTelemetry = telemetry[telemetry.length - 1];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(3);
    return `${mins}:${secs.padStart(6, '0')}`;
  };

  const TelemetryGauge: React.FC<{ value: number; max: number; label: string; color: string }> = ({ 
    value, max, label, color 
  }) => (
    <div className="text-center">
      <div className="relative w-20 h-20 mx-auto mb-2">
        <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="#374151"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${(value / max) * 251.2} 251.2`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold">{Math.round(value)}</span>
        </div>
      </div>
      <span className="text-sm text-gray-400">{label}</span>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-f1-red"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Telemetry Dashboard</h2>
          <p className="text-gray-400">
            {currentDriver?.name} - {currentDriver?.team}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm text-green-400">Live</span>
          </div>
        </div>
      </div>

      {/* Real-time gauges */}
      {latestTelemetry && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <TelemetryGauge
            value={latestTelemetry.speed}
            max={350}
            label="Speed (km/h)"
            color="#f1-red"
          />
          <TelemetryGauge
            value={latestTelemetry.throttle}
            max={100}
            label="Throttle (%)"
            color="#00D2BE"
          />
          <TelemetryGauge
            value={latestTelemetry.brake}
            max={100}
            label="Brake (%)"
            color="#FF8700"
          />
          <TelemetryGauge
            value={latestTelemetry.rpm}
            max={12000}
            label="RPM"
            color="#0600EF"
          />
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Speed over time */}
        <div className="f1-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Speed Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={telemetry.slice(-50)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="timestamp" 
                stroke="#9CA3AF"
                tickFormatter={(value) => new Date(value * 1000).toLocaleTimeString()}
              />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#374151', 
                  border: '1px solid #4B5563',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="speed" 
                stroke="#f1-red" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Throttle vs Brake */}
        <div className="f1-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Throttle vs Brake</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={telemetry.slice(-50)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="timestamp" 
                stroke="#9CA3AF"
                tickFormatter={(value) => new Date(value * 1000).toLocaleTimeString()}
              />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#374151', 
                  border: '1px solid #4B5563',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="throttle" 
                stroke="#00D2BE" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="brake" 
                stroke="#FF8700" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Analysis data */}
      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Corner speeds */}
          <div className="f1-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Corner Speeds</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analysis.corner_speeds}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="corner" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#374151', 
                    border: '1px solid #4B5563',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="speed" fill="#f1-red" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Throttle control */}
          <div className="f1-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Throttle Control</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analysis.throttle_control}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="timestamp" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#374151', 
                    border: '1px solid #4B5563',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="throttle" 
                  stroke="#00D2BE" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Current telemetry details */}
      {latestTelemetry && (
        <div className="f1-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Current Telemetry</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-f1-red">{Math.round(latestTelemetry.speed)}</div>
              <div className="text-sm text-gray-400">Speed (km/h)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-f1-green">{Math.round(latestTelemetry.throttle)}%</div>
              <div className="text-sm text-gray-400">Throttle</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-f1-orange">{Math.round(latestTelemetry.brake)}%</div>
              <div className="text-sm text-gray-400">Brake</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-f1-blue">{latestTelemetry.gear}</div>
              <div className="text-sm text-gray-400">Gear</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{latestTelemetry.rpm.toLocaleString()}</div>
              <div className="text-sm text-gray-400">RPM</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{latestTelemetry.sector}</div>
              <div className="text-sm text-gray-400">Sector</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{Math.round(latestTelemetry.steering * 100)}%</div>
              <div className="text-sm text-gray-400">Steering</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {latestTelemetry.lap_time ? formatTime(latestTelemetry.lap_time) : '--'}
              </div>
              <div className="text-sm text-gray-400">Lap Time</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TelemetryDashboard; 