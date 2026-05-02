import { useState, useEffect, useRef } from 'react';
import { 
  Plane, 
  Wallet, 
  History, 
  Zap, 
  TrendingUp, 
  Settings, 
  HelpCircle,
  Menu,
  X,
  Plus,
  Minus,
  Coins
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GamePhase, GameHistory } from './types';

const INITIAL_BALANCE = 1000;
const COUNTDOWN_TIME = 5; // seconds between rounds

export default function App() {
  // Game State
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [currentBet, setCurrentBet] = useState(10);
  const [phase, setPhase] = useState<GamePhase>('WAITING');
  const [multiplier, setMultiplier] = useState(1.00);
  const [crashPoint, setCrashPoint] = useState(0);
  const [history, setHistory] = useState<GameHistory[]>([]);
  const [countdown, setCountdown] = useState(0);
  const [hasBet, setHasBet] = useState(false);
  const [cashedOutAt, setCashedOutAt] = useState<number | null>(null);

  // Refs for animation and logic
  const timerRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const generateCrashPoint = () => {
    const r = Math.random();
    if (r < 0.03) return 1.00; // House edge / Instant crash
    return Math.max(1.00, 1 / (1 - r * 0.97));
  };

  const startRound = () => {
    const cp = generateCrashPoint();
    setCrashPoint(cp);
    setPhase('RUNNING');
    setMultiplier(1.00);
    setCashedOutAt(null);
    lastUpdateRef.current = Date.now();
    
    const update = () => {
      const now = Date.now();
      const elapsed = (now - lastUpdateRef.current) / 1000;
      
      setMultiplier(prev => {
        const next = prev * (1 + 0.15 * elapsed); // Growth speed
        
        if (next >= cp) {
          endRound(cp);
          return cp;
        }
        return next;
      });
      
      lastUpdateRef.current = now;
      timerRef.current = requestAnimationFrame(update);
    };
    
    timerRef.current = requestAnimationFrame(update);
  };

  const endRound = (final: number) => {
    if (timerRef.current) cancelAnimationFrame(timerRef.current);
    setPhase('CRASHED');
    setHasBet(false);
    
    const newHistory: GameHistory = {
      id: Math.random().toString(36).substr(2, 9),
      crashPoint: final,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    
    setHistory(prev => [newHistory, ...prev].slice(0, 20));
    setCountdown(COUNTDOWN_TIME);
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && phase === 'CRASHED') {
      setPhase('WAITING');
    }
  }, [countdown, phase]);

  const handlePlaceBet = () => {
    if (balance >= currentBet && phase === 'WAITING' && !hasBet) {
      setBalance(b => b - currentBet);
      setHasBet(true);
    }
  };

  const handleCashOut = () => {
    if (phase === 'RUNNING' && hasBet && !cashedOutAt) {
      const winAmount = currentBet * multiplier;
      setBalance(b => b + winAmount);
      setCashedOutAt(multiplier);
    }
  };

  useEffect(() => {
    if (phase === 'WAITING' && countdown === 0) {
      startRound();
    }
  }, [phase, countdown]);

  useEffect(() => {
    return () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col p-4 md:p-8 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <Plane className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black italic tracking-tighter text-white">SKYHIGH</h1>
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest leading-none">Powered by ProGamer</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-slate-950 px-6 py-2 rounded-xl border border-slate-800 flex items-center gap-3 shadow-inner">
            <Wallet className="w-4 h-4 text-accent" />
            <span className="text-accent font-mono text-lg font-bold">${balance.toFixed(2)}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
        {/* Main Game Screen */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
            {history.map((h) => (
              <div 
                key={h.id} 
                className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold font-mono border whitespace-nowrap ${
                  h.crashPoint >= 2 ? 'bg-primary/20 border-primary text-primary' : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                {h.crashPoint.toFixed(2)}x
              </div>
            ))}
          </div>

          <div className="flex-1 bg-slate-1000 rounded-3xl border border-slate-800 relative overflow-hidden flex items-center justify-center p-12 min-h-[400px]">
             {/* Grid Lines */}
             <div className="absolute inset-0 opacity-10 pointer-events-none" 
                  style={{ backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

             {/* Multiplier Display */}
             <div className="relative z-10 text-center">
               <AnimatePresence mode="wait">
                 {phase === 'CRASHED' ? (
                   <motion.div
                     initial={{ scale: 0.8, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     className="flex flex-col items-center"
                   >
                     <span className="text-primary text-[10vw] font-black leading-none drop-shadow-lg scale-110">FLEW AWAY!</span>
                     <span className="text-white text-5xl font-mono block mt-2 opacity-50">{multiplier.toFixed(2)}x</span>
                   </motion.div>
                 ) : (
                   <div className="flex flex-col items-center">
                     <span className={`text-[12vw] font-black leading-none font-mono transition-all duration-300 ${cashedOutAt ? 'text-emerald-500 multiplier-glow' : 'text-white'}`}>
                       {multiplier.toFixed(2)}x
                     </span>
                     {phase === 'WAITING' && (
                       <span className="text-slate-500 font-bold uppercase tracking-[0.3em] mt-4 flex items-center gap-2">
                         <Zap className="w-4 h-4 animate-pulse" />
                         Next Round In {countdown}s
                       </span>
                     )}
                   </div>
                 )}
               </AnimatePresence>
             </div>

             {/* Plane Animation */}
             <div className="absolute inset-0 pointer-events-none">
                <AnimatePresence>
                  {phase === 'RUNNING' && (
                    <motion.div
                       initial={{ x: '-10%', y: '80%', scale: 0.5 }}
                       animate={{ 
                         x: `${Math.min(85, (multiplier - 1) * 25)}%`, 
                         y: `${Math.max(10, 80 - (multiplier - 1) * 20)}%`,
                         scale: 1.2
                       }}
                       exit={{ 
                         x: '120%', 
                         y: '-30%',
                         transition: { duration: 0.4, ease: "easeIn" }
                       }}
                       className="absolute w-24 h-24 text-primary plane-glow"
                    >
                       <Plane className="w-full h-full transform -rotate-12" strokeWidth={1.5} fill="currentColor" />
                       <div className="absolute left-0 top-1/2 w-[300vw] h-0.5 bg-gradient-to-r from-transparent via-primary/10 to-primary/40 -z-10 transform -translate-x-full origin-right -rotate-1"></div>
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>
          </div>

          {/* Control Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="casino-card bg-slate-900 border-2 border-slate-800 p-6 flex flex-col gap-4">
                <div className="flex justify-between items-center mb-1">
                   <div className="flex gap-2 items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <Coins className="w-4 h-4" />
                      Bet Size
                   </div>
                   <div className="flex gap-1">
                      {[10, 50, 100].map(val => (
                        <button 
                          key={val}
                          onClick={() => setCurrentBet(val)}
                          className="px-2 py-0.5 bg-slate-800 rounded text-[10px] font-bold text-slate-400 hover:text-white"
                        >
                          ${val}
                        </button>
                      ))}
                   </div>
                </div>
                
                <div className="flex items-center bg-slate-950 p-2 rounded-xl border border-slate-800">
                   <button onClick={() => setCurrentBet(b => Math.max(1, b - 5))} className="p-2 text-slate-500 hover:text-white"><Minus className="w-5 h-5" /></button>
                   <input 
                     type="number" 
                     value={currentBet} 
                     onChange={(e) => setCurrentBet(Number(e.target.value))}
                     className="flex-1 bg-transparent text-center font-bold text-xl outline-none"
                   />
                   <button onClick={() => setCurrentBet(b => b + 5)} className="p-2 text-slate-500 hover:text-white"><Plus className="w-5 h-5" /></button>
                </div>

                {phase === 'RUNNING' && hasBet && !cashedOutAt ? (
                  <button 
                    onClick={handleCashOut}
                    className="w-full bg-accent hover:bg-amber-600 text-slate-950 font-black py-4 rounded-2xl flex flex-col items-center justify-center transition-all transform active:scale-95 shadow-lg shadow-accent/20"
                  >
                    <span className="text-[10px] uppercase tracking-widest leading-none mb-1">Cash Out</span>
                    <span className="text-2xl">${(currentBet * multiplier).toFixed(2)}</span>
                  </button>
                ) : (
                  <button 
                    onClick={handlePlaceBet}
                    disabled={hasBet || phase !== 'WAITING' || balance < currentBet}
                    className={`w-full font-black py-6 rounded-2xl flex items-center justify-center gap-2 transition-all transform active:scale-95 shadow-lg ${
                      hasBet 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default' 
                      : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-emerald-500/20'
                    }`}
                  >
                    {hasBet && phase !== 'WAITING' ? 'BET ACTIVE' : 'PLACE BET'}
                  </button>
                )}

                {cashedOutAt && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="text-center"
                   >
                     <span className="text-emerald-500 font-bold uppercase text-[10px] tracking-widest">
                       Win: +${(currentBet * cashedOutAt).toFixed(2)}
                     </span>
                   </motion.div>
                )}
             </div>

             <div className="casino-card hidden md:flex flex-col justify-between overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <TrendingUp className="w-32 h-32" />
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Market Conditions</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 font-bold">Server Load</span>
                      <span className="text-emerald-500 font-bold">STABLE</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 font-bold">RTP</span>
                      <span className="text-slate-200">97.0%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 font-bold">Hash Type</span>
                      <span className="text-slate-400 font-mono">SHA-256</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <p className="text-[10px] text-slate-500 flex items-center gap-2">
                    <TrendingUp className="w-3 h-3 text-primary" />
                    High volatility detected in current sequence.
                  </p>
                </div>
             </div>
          </div>
        </div>

        {/* Sidebar History */}
        <aside className="w-full lg:w-80 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col shrink-0 overflow-hidden">
          <div className="flex items-center gap-2 mb-6">
            <History className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Global History</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar">
             {history.map((h) => (
                <div key={h.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center group hover:border-slate-700 transition-colors">
                   <div className="flex flex-col">
                      <span className="text-slate-600 text-[10px] font-mono leading-none">{h.time}</span>
                      <span className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest">CRASH</span>
                   </div>
                   <span className={`font-mono font-black text-lg ${h.crashPoint >= 2 ? 'text-primary' : 'text-slate-700'}`}>
                      {h.crashPoint.toFixed(2)}x
                   </span>
                </div>
             ))}

             {history.length === 0 && (
               <div className="flex flex-col items-center justify-center py-20 text-slate-800">
                 <div className="w-12 h-12 bg-slate-950 rounded-full border border-slate-800 flex items-center justify-center mb-4">
                    <History className="w-6 h-6 opacity-20" />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest opacity-20">Analyzing Flow...</span>
               </div>
             )}
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-800 flex justify-between items-center">
            <button className="flex items-center gap-2 text-[10px] font-black text-slate-600 hover:text-white uppercase tracking-widest transition-colors">
               <HelpCircle className="w-4 h-4" />
               Support
            </button>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
              <div className="w-2 h-2 rounded-full bg-primary opacity-20"></div>
            </div>
          </div>
        </aside>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
