from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
import asyncio
import json
import random
from datetime import datetime, timedelta
import httpx
from pathlib import Path

app = FastAPI(
    title="F1 Analytics API",
    description="Comprehensive F1 racing analytics and live telemetry API",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                pass

manager = ConnectionManager()

# Pydantic models
class Driver(BaseModel):
    id: str
    name: str
    team: str
    number: int
    color: str

class TelemetryData(BaseModel):
    driver_id: str
    timestamp: float
    position: Dict[str, float]
    speed: float
    throttle: float
    brake: float
    steering: float
    gear: int
    rpm: int
    lap_time: Optional[float] = None
    sector: int = 1

class RaceSession(BaseModel):
    id: str
    name: str
    circuit: str
    date: str
    status: str
    drivers: List[Driver]

# Mock data for demonstration
DRIVERS = [
    Driver(id="HAM", name="Lewis Hamilton", team="Mercedes", number=44, color="#00D2BE"),
    Driver(id="VER", name="Max Verstappen", team="Red Bull Racing", number=1, color="#0600EF"),
    Driver(id="PER", name="Sergio Perez", team="Red Bull Racing", number=11, color="#0600EF"),
    Driver(id="LEC", name="Charles Leclerc", team="Ferrari", number=16, color="#DC0000"),
    Driver(id="SAI", name="Carlos Sainz", team="Ferrari", number=55, color="#DC0000"),
    Driver(id="NOR", name="Lando Norris", team="McLaren", number=4, color="#FF8700"),
    Driver(id="PIA", name="Oscar Piastri", team="McLaren", number=81, color="#FF8700"),
    Driver(id="ALO", name="Fernando Alonso", team="Aston Martin", number=14, color="#006F62"),
    Driver(id="STR", name="Lance Stroll", team="Aston Martin", number=18, color="#006F62"),
    Driver(id="RUS", name="George Russell", team="Mercedes", number=63, color="#00D2BE"),
]

# Circuit data (Monaco GP example)
CIRCUIT_POINTS = [
    {"lat": 43.7347, "lng": 7.4206, "name": "Start/Finish"},
    {"lat": 43.7345, "lng": 7.4208, "name": "Turn 1"},
    {"lat": 43.7340, "lng": 7.4215, "name": "Turn 2"},
    {"lat": 43.7335, "lng": 7.4220, "name": "Turn 3"},
    {"lat": 43.7330, "lng": 7.4225, "name": "Turn 4"},
    {"lat": 43.7325, "lng": 7.4230, "name": "Turn 5"},
    {"lat": 43.7320, "lng": 7.4235, "name": "Turn 6"},
    {"lat": 43.7315, "lng": 7.4240, "name": "Turn 7"},
    {"lat": 43.7310, "lng": 7.4245, "name": "Turn 8"},
    {"lat": 43.7305, "lng": 7.4250, "name": "Turn 9"},
    {"lat": 43.7300, "lng": 7.4255, "name": "Turn 10"},
    {"lat": 43.7295, "lng": 7.4260, "name": "Turn 11"},
    {"lat": 43.7290, "lng": 7.4265, "name": "Turn 12"},
    {"lat": 43.7285, "lng": 7.4270, "name": "Turn 13"},
    {"lat": 43.7280, "lng": 7.4275, "name": "Turn 14"},
    {"lat": 43.7275, "lng": 7.4280, "name": "Turn 15"},
    {"lat": 43.7270, "lng": 7.4285, "name": "Turn 16"},
    {"lat": 43.7265, "lng": 7.4290, "name": "Turn 17"},
    {"lat": 43.7260, "lng": 7.4295, "name": "Turn 18"},
    {"lat": 43.7255, "lng": 7.4300, "name": "Turn 19"},
]

# API Routes
@app.get("/")
async def root():
    return {"message": "F1 Analytics API", "version": "1.0.0"}

@app.get("/api/drivers", response_model=List[Driver])
async def get_drivers():
    """Get all drivers"""
    return DRIVERS

@app.get("/api/drivers/{driver_id}", response_model=Driver)
async def get_driver(driver_id: str):
    """Get specific driver by ID"""
    driver = next((d for d in DRIVERS if d.id == driver_id), None)
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    return driver

@app.get("/api/circuit")
async def get_circuit():
    """Get circuit layout points"""
    return {"points": CIRCUIT_POINTS}

@app.get("/api/sessions")
async def get_sessions():
    """Get available race sessions"""
    sessions = [
        {
            "id": "monaco_2024_q3",
            "name": "Monaco GP 2024 - Qualifying Q3",
            "circuit": "Circuit de Monaco",
            "date": "2024-05-25",
            "status": "completed",
            "drivers": DRIVERS
        },
        {
            "id": "monaco_2024_race",
            "name": "Monaco GP 2024 - Race",
            "circuit": "Circuit de Monaco",
            "date": "2024-05-26",
            "status": "live",
            "drivers": DRIVERS
        }
    ]
    return sessions

@app.get("/api/sessions/{session_id}")
async def get_session(session_id: str):
    """Get specific session details"""
    sessions = {
        "monaco_2024_q3": {
            "id": "monaco_2024_q3",
            "name": "Monaco GP 2024 - Qualifying Q3",
            "circuit": "Circuit de Monaco",
            "date": "2024-05-25",
            "status": "completed",
            "drivers": DRIVERS,
            "lap_count": 78,
            "duration": "1:23:45.123"
        },
        "monaco_2024_race": {
            "id": "monaco_2024_race",
            "name": "Monaco GP 2024 - Race",
            "circuit": "Circuit de Monaco",
            "date": "2024-05-26",
            "status": "live",
            "drivers": DRIVERS,
            "lap_count": 78,
            "duration": "1:23:45.123"
        }
    }
    
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return sessions[session_id]

@app.get("/api/telemetry/{session_id}/{driver_id}")
async def get_telemetry(session_id: str, driver_id: str, lap: Optional[int] = None):
    """Get telemetry data for a driver in a session"""
    # Mock telemetry data
    telemetry_data = []
    base_time = datetime.now().timestamp()
    
    for i in range(100):
        telemetry_data.append({
            "driver_id": driver_id,
            "timestamp": base_time + i * 0.1,
            "position": {
                "lat": 43.7347 + random.uniform(-0.01, 0.01),
                "lng": 7.4206 + random.uniform(-0.01, 0.01)
            },
            "speed": random.uniform(50, 300),
            "throttle": random.uniform(0, 100),
            "brake": random.uniform(0, 100),
            "steering": random.uniform(-1, 1),
            "gear": random.randint(1, 8),
            "rpm": random.randint(8000, 12000),
            "lap_time": random.uniform(70, 85) if i % 20 == 0 else None,
            "sector": (i % 60) // 20 + 1
        })
    
    return telemetry_data

@app.get("/api/leaderboard/{session_id}")
async def get_leaderboard(session_id: str):
    """Get current leaderboard for a session"""
    leaderboard = []
    for i, driver in enumerate(DRIVERS):
        leaderboard.append({
            "position": i + 1,
            "driver": driver,
            "lap_time": random.uniform(70, 85),
            "gap": random.uniform(0, 15),
            "last_lap": random.uniform(70, 85),
            "best_lap": random.uniform(68, 75),
            "laps_completed": random.randint(1, 78)
        })
    
    # Sort by lap time
    leaderboard.sort(key=lambda x: x["lap_time"])
    for i, entry in enumerate(leaderboard):
        entry["position"] = i + 1
    
    return leaderboard

@app.get("/api/analysis/{session_id}/{driver_id}")
async def get_driver_analysis(session_id: str, driver_id: str):
    """Get detailed analysis for a driver"""
    analysis = {
        "driver_id": driver_id,
        "session_id": session_id,
        "braking_points": [
            {"lat": 43.7340, "lng": 7.4215, "intensity": random.uniform(0.3, 1.0)},
            {"lat": 43.7325, "lng": 7.4230, "intensity": random.uniform(0.3, 1.0)},
            {"lat": 43.7310, "lng": 7.4245, "intensity": random.uniform(0.3, 1.0)},
        ],
        "throttle_control": [
            {"timestamp": i * 0.1, "throttle": random.uniform(0, 100)} 
            for i in range(100)
        ],
        "corner_speeds": [
            {"corner": f"Turn {i+1}", "speed": random.uniform(80, 200)} 
            for i in range(19)
        ],
        "speed_map": [
            {"lat": 43.7347 + random.uniform(-0.01, 0.01), 
             "lng": 7.4206 + random.uniform(-0.01, 0.01), 
             "speed": random.uniform(50, 300)} 
            for _ in range(50)
        ]
    }
    return analysis

@app.get("/api/comparison/{session_id}")
async def get_driver_comparison(session_id: str, driver1: str, driver2: str):
    """Compare two drivers"""
    comparison = {
        "session_id": session_id,
        "driver1": {
            "id": driver1,
            "avg_lap_time": random.uniform(70, 85),
            "best_lap_time": random.uniform(68, 75),
            "top_speed": random.uniform(280, 320),
            "avg_speed": random.uniform(150, 200),
            "consistency": random.uniform(0.8, 1.0)
        },
        "driver2": {
            "id": driver2,
            "avg_lap_time": random.uniform(70, 85),
            "best_lap_time": random.uniform(68, 75),
            "top_speed": random.uniform(280, 320),
            "avg_speed": random.uniform(150, 200),
            "consistency": random.uniform(0.8, 1.0)
        }
    }
    return comparison

# WebSocket for live data
@app.websocket("/ws/live/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await manager.connect(websocket)
    try:
        while True:
            # Simulate live telemetry data
            live_data = {
                "type": "telemetry",
                "session_id": session_id,
                "timestamp": datetime.now().isoformat(),
                "drivers": []
            }
            
            for driver in DRIVERS:
                live_data["drivers"].append({
                    "driver_id": driver.id,
                    "position": {
                        "lat": 43.7347 + random.uniform(-0.01, 0.01),
                        "lng": 7.4206 + random.uniform(-0.01, 0.01)
                    },
                    "speed": random.uniform(50, 300),
                    "throttle": random.uniform(0, 100),
                    "brake": random.uniform(0, 100),
                    "lap": random.randint(1, 78),
                    "sector": random.randint(1, 3)
                })
            
            await websocket.send_text(json.dumps(live_data))
            await asyncio.sleep(0.1)  # 10 FPS
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 