"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, Users, Network, Zap, ChevronRight, Plus, Trash2 } from 'lucide-react';

export default function WorldBuilder() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('topic');
  
  // Basic State structure based on PRD
  const [topic, setTopic] = useState('Is AI replacing programmers?');
  const [characters, setCharacters] = useState([
    { id: 1, name: 'Budi', role: 'Programmer', personality: 'Logical, critical', goal: 'Prove programmers are essential', style: 'Technical' },
    { id: 2, name: 'Rina', role: 'Influencer', personality: 'Energetic, trendy', goal: 'Get more views using AI', style: 'Casual and engaging' }
  ]);
  const [settings, setSettings] = useState<{ rounds: number | string, responseLength: string }>({ rounds: 10, responseLength: 'short' });

  const startSimulation = async () => {
    // In a real app, save to backend via API, then redirect to simulation page
    // For now, we'll store basic config in localStorage and redirect
    const config = { topic, characters, settings };
    localStorage.setItem('simulation_config', JSON.stringify(config));
    router.push('/simulation');
  };

  const addCharacter = () => {
    if (characters.length >= 20) return;
    setCharacters([...characters, { id: Date.now(), name: 'New Char', role: '', personality: '', goal: '', style: '' }]);
  };

  const updateCharacter = (id: number, field: string, value: string) => {
    setCharacters(characters.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const removeCharacter = (id: number) => {
    if (characters.length <= 2) return;
    setCharacters(characters.filter(c => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">World Builder</h1>
            <p className="text-slate-400 mt-2">Design your AI reality show environment</p>
          </div>
          <button 
            onClick={startSimulation}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)]"
          >
            START SIMULATION <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Sidebar Tabs */}
          <div className="space-y-2">
            {[
              { id: 'topic', label: 'Main Topic', icon: Zap },
              { id: 'characters', label: 'Characters', icon: Users },
              { id: 'relationships', label: 'Relationships', icon: Network },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === tab.id 
                    ? 'bg-indigo-600/20 text-indigo-400 ring-1 ring-indigo-500/30' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Configuration Panel */}
          <div className="md:col-span-3 glass-panel rounded-2xl p-6 md:p-8 min-h-[500px]">
            
            {/* TOPIC TAB */}
            {activeTab === 'topic' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Main Topic</h2>
                  <p className="text-slate-400 mb-6">The central theme that characters will discuss and debate.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Scenario / Question</label>
                  <textarea 
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                    rows={4}
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Is AI replacing programmers?"
                  />
                </div>
              </div>
            )}

            {/* CHARACTERS TAB */}
            {activeTab === 'characters' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Characters ({characters.length}/20)</h2>
                    <p className="text-slate-400 text-sm">Define the cast of your simulation.</p>
                  </div>
                  <button 
                    onClick={addCharacter}
                    disabled={characters.length >= 20}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" /> Add Character
                  </button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {characters.map(char => (
                    <div key={char.id} className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-xl space-y-4">
                      <div className="flex justify-between items-start">
                        <input 
                          className="bg-transparent text-lg font-bold text-white outline-none border-b border-transparent focus:border-indigo-500 px-1 w-full max-w-[200px]"
                          value={char.name}
                          onChange={(e) => updateCharacter(char.id, 'name', e.target.value)}
                          placeholder="Character Name"
                        />
                        <button 
                          onClick={() => removeCharacter(char.id)}
                          disabled={characters.length <= 2}
                          className="text-slate-500 hover:text-red-400 p-1 disabled:opacity-20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-slate-400 uppercase font-semibold">Role</label>
                          <input 
                            className="w-full bg-slate-900/50 border border-slate-700 rounded p-2 text-sm text-slate-200 outline-none focus:border-indigo-500"
                            value={char.role}
                            onChange={(e) => updateCharacter(char.id, 'role', e.target.value)}
                            placeholder="e.g. Programmer"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-400 uppercase font-semibold">Personality</label>
                          <input 
                            className="w-full bg-slate-900/50 border border-slate-700 rounded p-2 text-sm text-slate-200 outline-none focus:border-indigo-500"
                            value={char.personality}
                            onChange={(e) => updateCharacter(char.id, 'personality', e.target.value)}
                            placeholder="e.g. Logical, critical"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-400 uppercase font-semibold">Goal</label>
                          <input 
                            className="w-full bg-slate-900/50 border border-slate-700 rounded p-2 text-sm text-slate-200 outline-none focus:border-indigo-500"
                            value={char.goal}
                            onChange={(e) => updateCharacter(char.id, 'goal', e.target.value)}
                            placeholder="e.g. Prove programmers are essential"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-400 uppercase font-semibold">Speaking Style</label>
                          <input 
                            className="w-full bg-slate-900/50 border border-slate-700 rounded p-2 text-sm text-slate-200 outline-none focus:border-indigo-500"
                            value={char.style}
                            onChange={(e) => updateCharacter(char.id, 'style', e.target.value)}
                            placeholder="e.g. Technical and concise"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Simulation Settings</h2>
                  <p className="text-slate-400 mb-6">Configure how the simulation runs.</p>
                </div>
                
                <div className="space-y-6 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Maximum Rounds</label>
                    <select 
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      value={settings.rounds}
                      onChange={(e) => setSettings({ ...settings, rounds: e.target.value === 'Unlimited' ? 'Unlimited' : Number(e.target.value) })}
                    >
                      <option value={10}>10 Rounds</option>
                      <option value={20}>20 Rounds</option>
                      <option value={50}>50 Rounds</option>
                      <option value="Unlimited">Unlimited</option>
                    </select>
                    <p className="text-xs text-slate-500 mt-2">Simulation will automatically stop after reaching this many turns.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Response Length</label>
                    <select 
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      value={settings.responseLength}
                      onChange={(e) => setSettings({ ...settings, responseLength: e.target.value })}
                    >
                      <option value="short">Short (1-2 sentences)</option>
                      <option value="medium">Medium (1 paragraph)</option>
                      <option value="long">Long (Detailed)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* RELATIONSHIPS TAB (Placeholder) */}
            {activeTab === 'relationships' && (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
                <Network className="w-12 h-12 opacity-20" />
                <p>Relationship mapping feature is coming soon.</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
