const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./database');
const engine = require('./engine');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/save-scenario', (req, res) => {
  const { name, data } = req.body;
  const jsonString = JSON.stringify(data);
  db.run(`INSERT INTO simulations (name, data) VALUES (?, ?)`, [name, jsonString], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID });
  });
});

app.get('/api/load-scenarios', (req, res) => {
  db.all(`SELECT id, name, created_at FROM simulations ORDER BY created_at DESC`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.get('/api/scenario/:id', (req, res) => {
  db.get(`SELECT * FROM simulations WHERE id = ?`, [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) return res.status(404).json({ error: 'Scenario not found' });
    row.data = JSON.parse(row.data);
    res.json(row);
  });
});

// Real-time Simulation Socket
let simulationState = {
  isRunning: false,
  isPaused: false,
  round: 0,
  maxRounds: 0,
  worldState: null
};

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('start-simulation', async (config) => {
    console.log('Starting simulation with config:', config);
    simulationState.isRunning = true;
    simulationState.isPaused = false;
    simulationState.round = 0;
    simulationState.maxRounds = config.settings.rounds || 10;
    simulationState.worldState = engine.initializeWorld(config);
    
    io.emit('simulation-status', simulationState);
    
    // Start simulation loop
    runSimulationLoop();
  });

  socket.on('pause-simulation', () => {
    simulationState.isPaused = true;
    io.emit('simulation-status', simulationState);
  });

  socket.on('resume-simulation', () => {
    simulationState.isPaused = false;
    io.emit('simulation-status', simulationState);
    runSimulationLoop();
  });

  socket.on('stop-simulation', () => {
    simulationState.isRunning = false;
    io.emit('simulation-status', simulationState);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

async function runSimulationLoop() {
  while (
    simulationState.isRunning && 
    !simulationState.isPaused && 
    (simulationState.maxRounds === 'Unlimited' || simulationState.round < simulationState.maxRounds)
  ) {
    simulationState.round++;
    
    // Process one turn via Engine
    const turnResult = await engine.processTurn(simulationState.worldState, (speakerName) => {
      io.emit('typing', { speaker: speakerName });
    });
    
    // Broadcast the result
    io.emit('new-turn', {
      round: simulationState.round,
      speaker: turnResult.speaker,
      message: turnResult.message,
      event: turnResult.event,
      dramaLog: turnResult.dramaLog,
      worldState: simulationState.worldState
    });

    // Wait 3 seconds before next turn
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  if (simulationState.isRunning && !simulationState.isPaused) {
    simulationState.isRunning = false;
    io.emit('simulation-finished');
  }
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
