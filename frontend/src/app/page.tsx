import Link from 'next/link';
import { Play, FolderOpen, Activity } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-3xl mb-12">
        <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
          <Activity className="w-6 h-6 mr-2 animate-pulse" />
          <span className="text-sm font-semibold tracking-wider uppercase">Live Simulation Engine</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400">
          AI Reality Show <br /> Simulator
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Create dynamic AI societies. Define personas, spark conflicts, and watch unpredictable social dynamics unfold in real-time.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md justify-center">
        <Link 
          href="/builder" 
          className="group relative flex items-center justify-center gap-3 w-full py-4 px-8 rounded-xl bg-indigo-600 text-white font-semibold text-lg transition-all hover:bg-indigo-500 hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] active:scale-95"
        >
          <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
          Create Simulation
          <div className="absolute inset-0 rounded-xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all pointer-events-none" />
        </Link>
        
        <button 
          className="group relative flex items-center justify-center gap-3 w-full py-4 px-8 rounded-xl glass text-slate-200 font-semibold text-lg transition-all hover:bg-slate-800/80 hover:text-white active:scale-95"
        >
          <FolderOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
          Load Simulation
        </button>
      </div>
      
      {/* Background Orbs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] -z-10 animate-pulse-slow"></div>
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[120px] -z-10 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

    </main>
  );
}
