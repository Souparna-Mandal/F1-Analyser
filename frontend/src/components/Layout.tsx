import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Map, 
  BarChart3, 
  Users, 
  Settings, 
  Play,
  Trophy,
  TrendingUp
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Live Map', href: '/live-map', icon: Map },
    { name: 'Telemetry', href: '/telemetry', icon: BarChart3 },
    { name: 'Driver Analysis', href: '/analysis', icon: Users },
    { name: 'Race Replay', href: '/replay', icon: Play },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    { name: 'Comparisons', href: '/comparisons', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-f1-dark">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-f1-gray/90 backdrop-blur-sm border-r border-white/10">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b border-white/10">
            <h1 className="text-2xl font-bold font-f1 text-f1-red">
              F1 ANALYTICS
            </h1>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-f1-red text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center justify-center">
              <Settings className="w-5 h-5 text-gray-400" />
              <span className="ml-2 text-sm text-gray-400">Settings</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="pl-64">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout; 