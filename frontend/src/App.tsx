import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import LiveMap from './components/LiveMap';
import TelemetryDashboard from './components/TelemetryDashboard';
import Leaderboard from './components/Leaderboard';
import { useF1Store } from './store';
import { getDrivers, getSessions } from './services/api';

// Dashboard component
const Dashboard: React.FC = () => {
  const { drivers, sessions, setDrivers, setSessions, setCurrentSession } = useF1Store();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [driversData, sessionsData] = await Promise.all([
          getDrivers(),
          getSessions()
        ]);
        setDrivers(driversData);
        setSessions(sessionsData);
        
        // Set first session as current
        if (sessionsData.length > 0) {
          setCurrentSession(sessionsData[0]);
        }
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };

    loadData();
  }, [setDrivers, setSessions, setCurrentSession]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2 font-f1">
          F1 ANALYTICS
        </h1>
        <p className="text-gray-400 text-lg">
          Live Racing Telemetry & Analysis Platform
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="f1-card p-6 text-center">
          <div className="text-3xl font-bold text-f1-red mb-2">{drivers.length}</div>
          <div className="text-gray-400">Active Drivers</div>
        </div>
        <div className="f1-card p-6 text-center">
          <div className="text-3xl font-bold text-f1-green mb-2">{sessions.length}</div>
          <div className="text-gray-400">Race Sessions</div>
        </div>
        <div className="f1-card p-6 text-center">
          <div className="text-3xl font-bold text-f1-blue mb-2">Live</div>
          <div className="text-gray-400">Real-time Data</div>
        </div>
      </div>

      {/* Recent sessions */}
      <div className="f1-card p-6">
        <h2 className="text-xl font-bold text-white mb-4">Recent Sessions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sessions.slice(0, 4).map((session) => (
            <div
              key={session.id}
              className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-white">{session.name}</h3>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  session.status === 'live' ? 'bg-green-500/20 text-green-400' :
                  session.status === 'completed' ? 'bg-gray-500/20 text-gray-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {session.status}
                </span>
              </div>
              <p className="text-gray-400 text-sm">{session.circuit}</p>
              <p className="text-gray-400 text-sm">{session.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top drivers */}
      <div className="f1-card p-6">
        <h2 className="text-xl font-bold text-white mb-4">Top Drivers</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {drivers.slice(0, 5).map((driver) => (
            <div
              key={driver.id}
              className="text-center p-4 rounded-lg bg-white/5 border border-white/10"
            >
              <div 
                className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: driver.color }}
              >
                {driver.number}
              </div>
              <div className="font-semibold text-white text-sm">{driver.name}</div>
              <div className="text-gray-400 text-xs">{driver.team}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Analysis component
const Analysis: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Driver Analysis</h2>
      <TelemetryDashboard />
    </div>
  );
};

// Replay component
const Replay: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Race Replay</h2>
      <div className="f1-card p-6 text-center">
        <p className="text-gray-400">Race replay functionality coming soon...</p>
      </div>
    </div>
  );
};

// Comparisons component
const Comparisons: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Driver Comparisons</h2>
      <div className="f1-card p-6 text-center">
        <p className="text-gray-400">Driver comparison functionality coming soon...</p>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/live-map" element={<LiveMap />} />
          <Route path="/telemetry" element={<TelemetryDashboard />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/replay" element={<Replay />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/comparisons" element={<Comparisons />} />
        </Routes>
      </Layout>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#374151',
            color: '#fff',
            border: '1px solid #4B5563',
          },
        }}
      />
    </>
  );
};

export default App; 