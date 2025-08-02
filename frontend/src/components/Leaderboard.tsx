import React, { useEffect, useState } from 'react';
import { useF1Store } from '../store';
import { getLeaderboard } from '../services/api';
import { LeaderboardEntry } from '../types';
import { Trophy, Clock, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface LeaderboardProps {
  sessionId?: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ sessionId = 'monaco_2024_race' }) => {
  const { currentSession } = useF1Store();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadLeaderboard = async () => {
      if (!sessionId) return;
      
      setIsLoading(true);
      try {
        const data = await getLeaderboard(sessionId);
        setLeaderboard(data);
      } catch (error) {
        console.error('Failed to load leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLeaderboard();
    const interval = setInterval(loadLeaderboard, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [sessionId]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(3);
    return `${mins}:${secs.padStart(6, '0')}`;
  };

  const formatGap = (gap: number) => {
    if (gap === 0) return 'Leader';
    return `+${formatTime(gap)}`;
  };

  const getPositionColor = (position: number) => {
    switch (position) {
      case 1: return 'text-yellow-400';
      case 2: return 'text-gray-300';
      case 3: return 'text-amber-600';
      default: return 'text-gray-400';
    }
  };

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return position;
    }
  };

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
          <h2 className="text-2xl font-bold text-white">Race Leaderboard</h2>
          <p className="text-gray-400">
            {currentSession?.name} - Live Updates
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm text-green-400">Live</span>
          </div>
        </div>
      </div>

      {/* Leaderboard table */}
      <div className="f1-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-f1-gray/50 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Pos</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Driver</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Team</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Last Lap</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Best Lap</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Gap</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Laps</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {leaderboard.map((entry, index) => (
                <tr 
                  key={entry.driver.id} 
                  className={`hover:bg-white/5 transition-colors duration-200 ${
                    index === 0 ? 'bg-yellow-500/10' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className={`text-lg font-bold ${getPositionColor(entry.position)}`}>
                        {getPositionIcon(entry.position)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: entry.driver.color }}
                      >
                        {entry.driver.number}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{entry.driver.name}</div>
                        <div className="text-sm text-gray-400">#{entry.driver.number}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.driver.color }}
                      ></div>
                      <span className="text-gray-300">{entry.driver.team}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-mono text-white">
                      {formatTime(entry.last_lap)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-mono text-f1-green">
                      {formatTime(entry.best_lap)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-mono text-gray-300">
                      {formatGap(entry.gap)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-gray-300">
                      {entry.laps_completed}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="f1-card p-6">
          <div className="flex items-center space-x-3">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">Leader</h3>
              <p className="text-gray-400">
                {leaderboard[0]?.driver.name || 'No data'}
              </p>
            </div>
          </div>
        </div>

        <div className="f1-card p-6">
          <div className="flex items-center space-x-3">
            <Clock className="w-8 h-8 text-f1-green" />
            <div>
              <h3 className="text-lg font-semibold text-white">Best Lap</h3>
              <p className="text-gray-400">
                {leaderboard[0]?.best_lap ? formatTime(leaderboard[0].best_lap) : 'No data'}
              </p>
            </div>
          </div>
        </div>

        <div className="f1-card p-6">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-f1-red" />
            <div>
              <h3 className="text-lg font-semibold text-white">Total Laps</h3>
              <p className="text-gray-400">
                {currentSession?.lap_count || 'Unknown'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Driver comparison highlights */}
      {leaderboard.length >= 2 && (
        <div className="f1-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Key Battles</h3>
          <div className="space-y-3">
            {leaderboard.slice(0, 5).map((entry, index) => {
              const nextEntry = leaderboard[index + 1];
              if (!nextEntry) return null;

              const gap = nextEntry.lap_time - entry.lap_time;
              const isClose = gap < 2; // Less than 2 seconds gap

              return (
                <div 
                  key={`battle-${index}`}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    isClose ? 'bg-f1-red/10 border border-f1-red/20' : 'bg-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: entry.driver.color }}
                    >
                      {entry.driver.number}
                    </div>
                    <span className="text-white font-medium">{entry.driver.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">vs</span>
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: nextEntry.driver.color }}
                    >
                      {nextEntry.driver.number}
                    </div>
                    <span className="text-white font-medium">{nextEntry.driver.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm">
                      {formatTime(gap)}
                    </div>
                    <div className="text-xs text-gray-400">gap</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard; 