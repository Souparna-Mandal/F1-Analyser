import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Icon } from 'leaflet';
import { useF1Store } from '../store';
import { getCircuit, createWebSocketConnection } from '../services/api';
import { Circuit, LiveTelemetry } from '../types';
import { Car, MapPin } from 'lucide-react';

const LiveMap: React.FC = () => {
  const { currentSession, liveTelemetry, setLiveTelemetry } = useF1Store();
  const [circuit, setCircuit] = useState<Circuit | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const loadCircuit = async () => {
      try {
        const circuitData = await getCircuit();
        setCircuit(circuitData);
      } catch (error) {
        console.error('Failed to load circuit:', error);
      }
    };

    loadCircuit();
  }, []);

  useEffect(() => {
    if (!currentSession) return;

    // Close existing connection
    if (wsRef.current) {
      wsRef.current.close();
    }

    // Create new WebSocket connection
    const ws = createWebSocketConnection(currentSession.id);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const data: LiveTelemetry = JSON.parse(event.data);
        setLiveTelemetry(data);
      } catch (error) {
        console.error('Failed to parse WebSocket data:', error);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [currentSession, setLiveTelemetry]);

  if (!circuit) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-f1-red mx-auto mb-4"></div>
          <p className="text-gray-400">Loading circuit data...</p>
        </div>
      </div>
    );
  }

  const circuitPoints = circuit.points.map(point => [point.lat, point.lng]);

  return (
    <div className="h-screen relative">
      {/* Header */}
      <div className="absolute top-4 left-4 z-10 bg-f1-gray/90 backdrop-blur-sm rounded-lg p-4 border border-white/10">
        <h2 className="text-xl font-bold text-white mb-2">Live Race Map</h2>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={isConnected ? 'text-green-400' : 'text-red-400'}>
              {isConnected ? 'Live' : 'Disconnected'}
            </span>
          </div>
          {currentSession && (
            <span className="text-gray-300">{currentSession.name}</span>
          )}
        </div>
      </div>

      {/* Map */}
      <MapContainer
        center={[43.7347, 7.4206]}
        zoom={16}
        className="h-full w-full"
        style={{ background: '#1a1a1a' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Circuit outline */}
        <Polyline
          positions={circuitPoints}
          color="#f1-red"
          weight={3}
          opacity={0.8}
        />

        {/* Circuit points */}
        {circuit.points.map((point, index) => (
          <Marker
            key={index}
            position={[point.lat, point.lng]}
            icon={new Icon({
              iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDkuNzRMMTIgMTZMMTAuOTEgOS43NEw0IDlMMTAuOTEgOC4yNkwxMiAyWiIgZmlsbD0iI0ZGNzg3MDAiLz4KPC9zdmc+',
              iconSize: [24, 24],
              iconAnchor: [12, 12],
            })}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-semibold">{point.name}</h3>
                <p className="text-sm text-gray-600">
                  {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Driver markers */}
        {liveTelemetry?.drivers.map((driver) => {
          const driverData = currentSession?.drivers.find(d => d.id === driver.driver_id);
          if (!driverData) return null;

          return (
            <Marker
              key={driver.driver_id}
              position={[driver.position.lat, driver.position.lng]}
              icon={new Icon({
                iconUrl: `data:image/svg+xml;base64,${btoa(`
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="12" fill="${driverData.color}" stroke="white" stroke-width="2"/>
                    <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">${driverData.number}</text>
                  </svg>
                `)}`,
                iconSize: [32, 32],
                iconAnchor: [16, 16],
              })}
            >
              <Popup>
                <div className="text-center min-w-[200px]">
                  <h3 className="font-bold text-lg">{driverData.name}</h3>
                  <p className="text-sm text-gray-600">{driverData.team}</p>
                  <div className="mt-2 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Speed:</span>
                      <span className="font-semibold">{Math.round(driver.speed)} km/h</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lap:</span>
                      <span className="font-semibold">{driver.lap}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sector:</span>
                      <span className="font-semibold">{driver.sector}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Throttle:</span>
                      <span className="font-semibold">{Math.round(driver.throttle)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Brake:</span>
                      <span className="font-semibold">{Math.round(driver.brake)}%</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Driver list overlay */}
      {liveTelemetry && (
        <div className="absolute top-4 right-4 z-10 bg-f1-gray/90 backdrop-blur-sm rounded-lg p-4 border border-white/10 max-h-96 overflow-y-auto">
          <h3 className="text-lg font-bold text-white mb-3">Drivers</h3>
          <div className="space-y-2">
            {liveTelemetry.drivers.map((driver) => {
              const driverData = currentSession?.drivers.find(d => d.id === driver.driver_id);
              if (!driverData) return null;

              return (
                <div
                  key={driver.driver_id}
                  className="flex items-center justify-between p-2 rounded bg-white/5"
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: driverData.color }}
                    ></div>
                    <span className="text-sm font-medium">{driverData.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">{Math.round(driver.speed)} km/h</div>
                    <div className="text-xs text-gray-400">Lap {driver.lap}</div>
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

export default LiveMap; 