"use client";

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Play, Pause, Square, RotateCcw, AlertTriangle, MessageSquare, Activity } from 'lucide-react';

export default function LiveSimulation() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [status, setStatus] = useState<any>({ isRunning: false, isPaused: false, round: 0 });
  const [history, setHistory] = useState<any[]>([]);
  const [dramaLogs, setDramaLogs] = useState<any[]>([]);
  const [characters, setCharacters] = useState<any[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);

  const [typingSpeaker, setTypingSpeaker] = useState<string | null>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('simulation-status', (state) => {
      setStatus(state);
      if (state.worldState) {
        setCharacters(state.worldState.characters);
      }
    });

    newSocket.on('typing', (data) => {
      setTypingSpeaker(data.speaker);
    });

    newSocket.on('new-turn', (data) => {
      setTypingSpeaker(null);
      setStatus((prev: any) => ({ ...prev, round: data.round }));
      setHistory((prev: any[]) => [...prev, data]);
      if (data.dramaLog) {
        setDramaLogs((prev: any[]) => [data.dramaLog, ...prev]);
      }
      if (data.worldState) {
        setCharacters(data.worldState.characters);
      }
    });

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom of chat
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [history]);

  const handleStart = () => {
    if (socket) {
      const configStr = localStorage.getItem('simulation_config');
      const config = configStr ? JSON.parse(configStr) : {
        topic: 'Default Topic',
        characters: [{ name: 'A', role: 'Role A' }, { name: 'B', role: 'Role B' }],
        settings: { rounds: 10, responseLength: 'short' }
      };
      socket.emit('start-simulation', config);
    }
  };

  const handlePauseResume = () => {
    if (socket) {
      if (status.isPaused) {
        socket.emit('resume-simulation');
      } else {
        socket.emit('pause-simulation');
      }
    }
  };

  const handleStop = () => {
    if (socket) socket.emit('stop-simulation');
  };

  return (
    <div className="h-screen bg-slate-950 flex flex-col font-sans text-slate-200">
      
      {/* Top Navigation / Controls */}
      <header className="h-16 border-b border-slate-800/60 bg-slate-900/50 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-lg">
            <Activity className="w-5 h-5" /> Live Simulation
          </div>
          <span className="text-sm font-mono text-slate-500 bg-slate-800 px-3 py-1 rounded-full">
            Round: {status.round}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          {!status.isRunning ? (
            <button 
              onClick={handleStart}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)]"
            >
              <Play className="w-4 h-4" /> Start
            </button>
          ) : (
            <>
              <button 
                onClick={handlePauseResume}
                className="flex items-center gap-2 bg-amber-600/20 text-amber-500 hover:bg-amber-600/30 px-4 py-2 rounded-lg text-sm font-semibold transition-all border border-amber-500/20"
              >
                {status.isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                {status.isPaused ? 'Resume' : 'Pause'}
              </button>
              <button 
                onClick={handleStop}
                className="flex items-center gap-2 bg-red-600/20 text-red-500 hover:bg-red-600/30 px-4 py-2 rounded-lg text-sm font-semibold transition-all border border-red-500/20"
              >
                <Square className="w-4 h-4" /> Stop
              </button>
            </>
          )}
          <button className="p-2 text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 3-Column Main Layout */}
      <main className="flex-1 overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Panel: Characters */}
        <aside className="w-full md:w-64 lg:w-80 border-r border-slate-800/60 bg-slate-900/30 flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-slate-800/60">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Cast / Agents</h2>
          </div>
          <div className="p-4 space-y-4">
            {characters.map((c, i) => (
              <div key={i} className="bg-slate-800/40 border border-slate-700/50 p-3 rounded-xl flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-indigo-300">{c.name}</span>
                  <span className="text-xs bg-slate-900 px-2 py-1 rounded text-slate-400">{c.role}</span>
                </div>
                {/* Emotion bars */}
                <div className="space-y-1 mt-2">
                  <div className="flex justify-between text-[10px] text-slate-500 uppercase">
                    <span>Stress</span>
                    <span>{Math.round(c.emotions?.stress || 0)}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1.5">
                    <div 
                      className="bg-red-500 h-1.5 rounded-full transition-all duration-500" 
                      style={{ width: `${c.emotions?.stress || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
            {characters.length === 0 && (
              <div className="text-center text-slate-500 text-sm py-10">
                Start simulation to load characters
              </div>
            )}
          </div>
        </aside>

        {/* Center Panel: Live Conversation */}
        <section className="flex-1 flex flex-col bg-[#0b1120] relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          
          <div className="p-4 border-b border-slate-800/60 flex items-center justify-between z-10 bg-[#0b1120]/80 backdrop-blur-md">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Live Feed
            </h2>
            {status.isRunning && !status.isPaused && (
              <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Processing next turn...
              </div>
            )}
          </div>

          {/* Chat List */}
          <div ref={chatRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 z-10 scroll-smooth">
            {history.length === 0 && (
              <div className="h-full flex items-center justify-center text-slate-600 italic">
                Awaiting simulation start...
              </div>
            )}
            
            {history.map((turn, i) => (
              <div key={i} className="flex flex-col max-w-3xl mx-auto w-full animate-in slide-in-from-bottom-4 fade-in duration-500">
                
                {turn.event && (
                  <div className="mx-auto my-6 px-4 py-2 bg-fuchsia-900/30 border border-fuchsia-500/30 rounded-lg text-center max-w-md">
                    <span className="text-xs font-bold text-fuchsia-400 uppercase tracking-widest block mb-1">Sudden Event</span>
                    <span className="text-sm text-fuchsia-100">{turn.event}</span>
                  </div>
                )}
                
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                      {turn.speaker.charAt(0)}
                    </div>
                    <span className="font-bold text-indigo-200">{turn.speaker}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[15px]">
                    {turn.message}
                  </p>
                </div>
                
              </div>
            ))}

            {typingSpeaker && (
              <div className="flex flex-col max-w-3xl mx-auto w-full animate-in slide-in-from-bottom-4 fade-in duration-500">
                <div className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-5 shadow-sm inline-flex items-center gap-3 self-start w-fit">
                  <div className="w-8 h-8 rounded-full bg-indigo-600/50 flex items-center justify-center text-white/70 font-bold text-xs">
                    {typingSpeaker.charAt(0)}
                  </div>
                  <div className="flex gap-1.5 items-center">
                    <span className="font-medium text-indigo-300/70 mr-2 text-sm">{typingSpeaker} is typing</span>
                    <span className="w-1.5 h-1.5 bg-indigo-400/70 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-400/70 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }}></span>
                    <span className="w-1.5 h-1.5 bg-indigo-400/70 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Right Panel: Drama Log & Events */}
        <aside className="w-full md:w-64 lg:w-80 border-l border-slate-800/60 bg-slate-900/30 flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-slate-800/60 flex items-center gap-2 text-rose-400">
            <AlertTriangle className="w-4 h-4" />
            <h2 className="text-sm font-bold uppercase tracking-wider">Drama Log</h2>
          </div>
          <div className="p-4 space-y-3">
            {dramaLogs.map((log, i) => (
              <div key={i} className="text-sm border-l-2 border-rose-500 pl-3 py-1 animate-in slide-in-from-right fade-in">
                <p className="text-slate-300">{log}</p>
              </div>
            ))}
            {dramaLogs.length === 0 && (
              <div className="text-center text-slate-600 text-xs py-5">
                No drama yet. It&apos;s too peaceful.
              </div>
            )}
          </div>
        </aside>

      </main>
    </div>
  );
}
