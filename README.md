# F1 Analytics Platform

A comprehensive Formula 1 racing analytics platform with live telemetry, interactive maps, driver comparisons, and real-time race data visualization.

## Features

### 🏎️ Live Racing Analytics
- **Real-time telemetry data** with WebSocket connections
- **Interactive live map** showing all driver positions
- **Live leaderboard** with automatic updates
- **Driver comparison tools** for detailed analysis

### 📊 Advanced Analytics
- **Telemetry dashboards** with real-time gauges and charts
- **Braking point analysis** and corner speed data
- **Throttle control visualization** and steering analysis
- **Speed maps** and sector timing breakdowns

### 🗺️ Interactive Maps
- **Circuit visualization** with turn-by-turn data
- **Live driver tracking** with real-time position updates
- **Speed heat maps** and braking zone analysis
- **Race replay functionality** (coming soon)

### 📈 Driver Analysis
- **Individual driver telemetry** with detailed metrics
- **Performance comparisons** between drivers
- **Historical data analysis** and trend visualization
- **Customizable dashboards** for different analysis needs

## Tech Stack

### Backend
- **FastAPI** - High-performance Python web framework
- **WebSockets** - Real-time data streaming
- **Pydantic** - Data validation and serialization
- **Uvicorn** - ASGI server for production deployment

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server
- **Recharts** - Beautiful and responsive charts
- **React Leaflet** - Interactive maps
- **Zustand** - Lightweight state management
- **Framer Motion** - Smooth animations

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Git

### Option 1: Easy Startup Script (Recommended)

#### On macOS/Linux:
```bash
./start.sh
```

#### On Windows:
```bash
start.bat
```

This will automatically:
- Check prerequisites
- Set up virtual environments
- Install all dependencies
- Start both backend and frontend servers

### Option 2: Manual Setup

#### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the backend server:**
   ```bash
   python main.py
   ```

The backend will be available at `http://localhost:8000`

#### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

### Option 3: Docker Setup

If you have Docker and Docker Compose installed:

```bash
docker-compose up --build
```

This will start both services in containers.

### Access Points

Once running, you can access:
- **Frontend Application**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## API Endpoints

### Core Endpoints
- `GET /api/drivers` - Get all drivers
- `GET /api/drivers/{driver_id}` - Get specific driver
- `GET /api/sessions` - Get all race sessions
- `GET /api/sessions/{session_id}` - Get session details
- `GET /api/leaderboard/{session_id}` - Get live leaderboard
- `GET /api/circuit` - Get circuit layout data

### Telemetry Endpoints
- `GET /api/telemetry/{session_id}/{driver_id}` - Get driver telemetry
- `GET /api/analysis/{session_id}/{driver_id}` - Get driver analysis
- `GET /api/comparison/{session_id}` - Compare two drivers

### WebSocket
- `WS /ws/live/{session_id}` - Live telemetry data stream

## Project Structure

```
F1-Analyser/
├── backend/
│   ├── main.py                 # FastAPI application
│   └── requirements.txt        # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── services/          # API services
│   │   ├── store/             # State management
│   │   ├── types/             # TypeScript definitions
│   │   └── App.tsx           # Main application
│   ├── package.json           # Node.js dependencies
│   └── vite.config.ts         # Vite configuration
└── README.md                  # This file
```

## Features in Detail

### Live Map
- Real-time driver positions on interactive circuit map
- Driver information popups with live telemetry
- Circuit turn markers and braking zones
- Live connection status indicator

### Telemetry Dashboard
- Real-time speed, throttle, brake, and RPM gauges
- Interactive charts showing data over time
- Corner speed analysis and throttle control visualization
- Current telemetry details with formatted values

### Leaderboard
- Live race positions with automatic updates
- Driver statistics and performance metrics
- Key battle highlights for close racing
- Session information and timing data

### Driver Analysis
- Detailed braking point analysis
- Throttle control patterns
- Corner speed comparisons
- Speed map visualization

## Development

### Backend Development
```bash
cd backend
python main.py
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Building for Production
```bash
cd frontend
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Formula 1 for the inspiration
- OpenStreetMap for map data
- The F1 community for feedback and suggestions