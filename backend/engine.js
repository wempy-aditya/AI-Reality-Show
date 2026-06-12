const { OpenAI } = require('openai');
const dotenv = require('dotenv');
dotenv.config();

// Default proxy or direct to OpenAI if key provided
const openaiOptions = {
  apiKey: process.env.OPENAI_API_KEY || 'dummy',
};

if (process.env.OPENAI_BASE_URL) {
  openaiOptions.baseURL = process.env.OPENAI_BASE_URL;
}

const openai = new OpenAI(openaiOptions);

function initializeWorld(config) {
  return {
    topic: config.topic,
    characters: config.characters.map(c => ({
      ...c,
      memory: [],
      emotions: { happiness: 50, anger: 0, confidence: 50, trust: 50, stress: 0 }
    })),
    relationships: config.relationships || [],
    events: config.events || [],
    settings: config.settings,
    history: [],
    dramaLogs: []
  };
}

async function processTurn(worldState, onTyping = () => {}) {
  // 1. Director Agent decides next speaker and if an event happens
  const directorPrompt = `
    You are the Director Agent for a reality show simulation.
    Topic: ${worldState.topic}
    Characters: ${worldState.characters.map(c => c.name).join(', ')}
    Recent History: ${JSON.stringify(worldState.history.slice(-3))}
    
    Choose the next speaker and decide if a random event should occur right now.
    Respond in JSON format: { "nextSpeaker": "Name", "event": "Event description or null" }
    IMPORTANT: If there is an event, describe it in INDONESIAN language.
  `;

  let nextSpeakerName;
  let currentEvent = null;

  try {
    const directorResponse = await callLLM(directorPrompt, true);
    nextSpeakerName = directorResponse.nextSpeaker;
    currentEvent = directorResponse.event;
  } catch (e) {
    // Fallback if LLM fails
    const randomIndex = Math.floor(Math.random() * worldState.characters.length);
    nextSpeakerName = worldState.characters[randomIndex].name;
  }

  let speaker = worldState.characters.find(c => c.name === nextSpeakerName);
  
  if (!speaker) {
    const fallbackIndex = Math.floor(Math.random() * worldState.characters.length);
    speaker = worldState.characters[fallbackIndex];
  }

  onTyping(speaker.name);

  // 2. Character speaks
  const charPrompt = `
    You are ${speaker.name}, a ${speaker.role}.
    Personality: ${speaker.personality}
    Goal: ${speaker.goal}
    Speaking Style: ${speaker.speakingStyle}
    Current Emotions: ${JSON.stringify(speaker.emotions)}
    
    Topic: ${worldState.topic}
    ${currentEvent ? `A sudden event just occurred: ${currentEvent}` : ''}
    
    Recent conversation:
    ${worldState.history.slice(-5).map(h => `${h.speaker}: ${h.message}`).join('\n')}
    
    Respond to the conversation naturally according to your persona and current emotions. 
    Keep your response ${worldState.settings?.responseLength || 'short'}.
    IMPORTANT: You MUST write your response, feeling, and dramaLog strictly in INDONESIAN language.
    Return JSON: { "message": "your response in Indonesian", "feeling": "how you feel (in Indonesian)", "dramaLog": "breaking news or drama log (in Indonesian), or null" }
  `;

  let message = "I have nothing to say.";
  let dramaLog = null;

  try {
    const charResponse = await callLLM(charPrompt, true);
    message = charResponse.message;
    dramaLog = charResponse.dramaLog;

    // Update memory
    speaker.memory.push(charResponse.feeling);
    if (speaker.memory.length > 5) speaker.memory.shift();

    // Simple emotion update (randomize slightly for simulation feel)
    speaker.emotions.stress = Math.min(100, Math.max(0, speaker.emotions.stress + (Math.random() * 10 - 5)));
  } catch (e) {
    console.error("Error generating character response:", e);
  }

  // Save history
  worldState.history.push({ speaker: speaker.name, message, event: currentEvent });

  if (dramaLog) {
    worldState.dramaLogs.push(dramaLog);
  }

  return {
    speaker: speaker.name,
    message,
    event: currentEvent,
    dramaLog
  };
}

async function callLLM(prompt, parseJson = false) {
  // If no real key, use a simple mock mechanism for now
  if (process.env.OPENAI_API_KEY === 'dummy' || !process.env.OPENAI_API_KEY) {
    return mockLLMResponse(prompt, parseJson);
  }

  const response = await openai.chat.completions.create({
    model: "oc/deepseek-v4-flash-free", // fallback model
    messages: [
      { role: "system", content: "You are a simulation engine API. Always return valid JSON." },
      { role: "user", content: prompt }
    ],
    response_format: parseJson ? { type: "json_object" } : { type: "text" }
  });

  const content = response.choices[0].message.content;
  return parseJson ? JSON.parse(content) : content;
}

function mockLLMResponse(prompt, parseJson) {
  if (prompt.includes('Director Agent')) {
    return { nextSpeaker: "MockSpeaker", event: null };
  }
  return { message: "Ini adalah balasan bayangan (mock) karena API Key LLM belum dimasukkan.", feeling: "Biasa saja", dramaLog: null };
}

module.exports = {
  initializeWorld,
  processTurn
};
