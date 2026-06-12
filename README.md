# AI Reality Show Simulator

Based on the Product Requirements Document (PRD), this project contains the MVP for the AI Reality Show Simulator.

## Architecture

* **Frontend**: Next.js (App Router), React, TailwindCSS, Socket.io-client.
* **Backend**: Node.js, Express, Socket.io, SQLite3, OpenAI API.

## Project Structure

* `/frontend`: The UI where users can configure worlds and watch the live simulation.
* `/backend`: The server and simulation engine handling agent states, memory, turn-taking, and LLM calls.

## How to Run

1. **Start the Backend:**
   \`\`\`bash
   cd backend
   npm install
   # (Optional) Create a .env file and add OPENAI_API_KEY=your_key
   npm start # or node index.js
   \`\`\`
   The backend will run on http://localhost:3001. If no OpenAI key is provided, it uses mock responses.

2. **Start the Frontend:**
   \`\`\`bash
   cd frontend
   npm install
   npm run dev
   \`\`\`
   The frontend will run on http://localhost:3000. Open this in your browser to view the simulator.
