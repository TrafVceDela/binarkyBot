import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Search,
  Cpu,
  BarChart3,
  Clock,
  ShieldCheck,
  ChevronRight,
  Zap,
  ChevronDown,
} from "lucide-react";

const App = () => {
  const [baseSymbol, setBaseSymbol] = useState("BTC");
  const [quoteSymbol, setQuoteSymbol] = useState("USDT");
  const [timeframe, setTimeframe] = useState("15m");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const timeframes = ["1m", "5m", "15m", "1h", "4h", "1d"];

  // Инициализация Telegram WebApp
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand(); // Развернуть на весь экран
      tg.enableClosingConfirmation(); // Подтверждение закрытия
    }
  }, []);

  const runAnalysis = () => {
    if (!baseSymbol.trim() || !quoteSymbol.trim()) {
      setError("Please fill both asset fields");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);
    setProgress(0);
    setError("");

    const fullSymbol = `${baseSymbol.toUpperCase()}/${quoteSymbol.toUpperCase()}`;

    // Имитация прогресса
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    setTimeout(() => {
      const isUp = Math.random() > 0.5;
      const confidence = Math.floor(Math.random() * (98 - 75 + 1) + 75);

      setResult({
        symbol: fullSymbol,
        signal: isUp ? "BUY" : "SELL",
        confidence: confidence,
        target: isUp
          ? `+${(Math.random() * 3).toFixed(2)}%`
          : `-${(Math.random() * 3).toFixed(2)}%`,
        entry: (Math.random() * 50000 + 1000).toFixed(2),
      });
      setIsAnalyzing(false);

      // Вибрация (Haptic Feedback) при получении результата
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred(
          isUp ? "success" : "warning",
        );
      }
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 flex flex-col items-center justify-start overflow-hidden select-none">
      {/* Фоновое свечение */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full" />
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-blue-600/10 blur-[100px] rounded-full" />
      </div>

      {/* Шапка */}
      <div className="w-full max-w-md mt-4 mb-10 text-center relative">
        <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-3xl mb-4 border border-blue-500/20 shadow-xl">
          <Cpu className="w-8 h-8 text-blue-400 animate-pulse" />
        </div>
        <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
          PREDICTOR AI
        </h1>
        <p className="text-slate-500 text-xs mt-2 uppercase tracking-[0.3em] font-bold">
          Quantum Analytics Engine
        </p>
      </div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Форма ввода */}
        {!isAnalyzing && !result && (
          <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Search className="w-3 h-3" /> Trading Pair
              </label>

              <div
                className={`flex items-center gap-0 bg-slate-800/40 border ${error ? "border-red-500/50" : "border-slate-700/50"} rounded-2xl p-1 focus-within:ring-2 focus-within:ring-blue-500/30 transition-all overflow-hidden`}
              >
                <input
                  type="text"
                  value={baseSymbol}
                  onChange={(e) => setBaseSymbol(e.target.value.toUpperCase())}
                  placeholder="BTC"
                  className="w-full bg-transparent py-4 px-4 focus:outline-none font-mono text-xl tracking-wider text-center"
                />
                <span className="text-slate-600 font-mono text-xl font-bold select-none">
                  /
                </span>
                <input
                  type="text"
                  value={quoteSymbol}
                  onChange={(e) => setQuoteSymbol(e.target.value.toUpperCase())}
                  placeholder="USDT"
                  className="w-full bg-transparent py-4 px-4 focus:outline-none font-mono text-xl tracking-wider text-center"
                />
              </div>
              {error && (
                <p className="text-red-400 text-[10px] font-bold ml-1">
                  {error}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Clock className="w-3 h-3" /> Timeframe
              </label>
              <div className="relative">
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="w-full bg-slate-800/40 border border-slate-700/50 rounded-2xl py-5 px-6 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all appearance-none font-bold text-lg"
                >
                  {timeframes.map((tf) => (
                    <option
                      key={tf}
                      value={tf}
                      className="bg-slate-900 text-white"
                    >
                      {tf} Interval
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-5 top-5 w-6 h-6 text-slate-500 pointer-events-none" />
              </div>
            </div>

            <button
              onClick={runAnalysis}
              className="w-full bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-blue-900/40 active:scale-[0.97] transition-all flex items-center justify-center gap-3 mt-4"
            >
              RUN ANALYSIS <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Состояние загрузки */}
        {isAnalyzing && (
          <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 p-10 rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center space-y-8 animate-in zoom-in-95 duration-500">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <div className="absolute inset-0 border-8 border-blue-500/5 rounded-full"></div>
              <svg className="w-full h-full rotate-[-90deg]">
                <circle
                  cx="80"
                  cy="80"
                  r="72"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={452.4}
                  strokeDashoffset={452.4 - (452.4 * progress) / 100}
                  strokeLinecap="round"
                  className="text-blue-500 transition-all duration-150 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-white">
                  {progress}%
                </span>
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-tighter">
                  Processing
                </span>
              </div>
            </div>

            <div className="text-center space-y-3">
              <h3 className="text-2xl font-black tracking-tight tracking-wider uppercase">
                Analyzing {baseSymbol}/{quoteSymbol}
              </h3>
              <div className="flex flex-col gap-1">
                <p className="text-slate-500 text-xs font-medium animate-pulse italic">
                  Scanning order books...
                </p>
                <p className="text-slate-500 text-xs font-medium animate-pulse delay-75 italic">
                  Neural patterns matching...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Экран результата */}
        {result && !isAnalyzing && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 slide-in-from-bottom-12 duration-1000 ease-out">
            <div className="text-center">
              <span className="bg-blue-500/10 text-blue-400 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-blue-500/20">
                AI Prediction Complete
              </span>
            </div>

            <div
              className={`p-10 rounded-[3rem] flex flex-col items-center justify-center space-y-6 border shadow-2xl relative overflow-hidden ${
                result.signal === "BUY"
                  ? "bg-green-500/5 border-green-500/20 shadow-green-900/10"
                  : "bg-red-500/5 border-red-500/20 shadow-red-900/10"
              }`}
            >
              <div
                className={`absolute -top-20 -left-20 w-40 h-40 blur-[80px] rounded-full ${result.signal === "BUY" ? "bg-green-500/20" : "bg-red-500/20"}`}
              ></div>

              {result.signal === "BUY" ? (
                <div className="w-28 h-28 bg-gradient-to-br from-green-400 to-emerald-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-green-500/40 animate-bounce">
                  <TrendingUp className="w-14 h-14 text-white" />
                </div>
              ) : (
                <div className="w-28 h-28 bg-gradient-to-br from-red-400 to-rose-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-red-500/40 animate-bounce">
                  <TrendingDown className="w-14 h-14 text-white" />
                </div>
              )}

              <div className="text-center">
                <p className="text-slate-400 text-xs font-black tracking-[0.3em] uppercase mb-1 opacity-60">
                  Result for {result.symbol}
                </p>
                <h2
                  className={`text-6xl font-black italic tracking-tighter mb-2 ${
                    result.signal === "BUY" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {result.signal === "BUY" ? "LONG ↑" : "SHORT ↓"}
                </h2>
                <div className="flex items-center justify-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full animate-ping ${result.signal === "BUY" ? "bg-green-500" : "bg-red-500"}`}
                  ></div>
                  <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">
                    {timeframe} Interval
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-xl">
                <p className="text-[10px] text-slate-500 uppercase font-black mb-2 tracking-widest">
                  Confidence
                </p>
                <div className="flex flex-col gap-2">
                  <p className="text-3xl font-black text-blue-400">
                    {result.confidence}%
                  </p>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-1000 delay-500"
                      style={{ width: `${result.confidence}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-xl">
                <p className="text-[10px] text-slate-500 uppercase font-black mb-2 tracking-widest">
                  Expected Move
                </p>
                <p
                  className={`text-3xl font-black ${result.signal === "BUY" ? "text-green-400" : "text-red-400"}`}
                >
                  {result.target}
                </p>
                <p className="text-[10px] text-slate-600 font-bold mt-1 uppercase tracking-tighter">
                  Growth Forecast
                </p>
              </div>
            </div>

            <button
              onClick={() => setResult(null)}
              className="w-full bg-slate-800/50 hover:bg-slate-800 py-5 rounded-2xl font-black text-slate-400 transition-all border border-slate-700/50 uppercase tracking-[0.2em] text-xs"
            >
              Back to Terminal
            </button>
          </div>
        )}
      </div>

      {/* Футер безопасности */}
      <div className="mt-auto pb-8 pt-12 flex flex-col items-center gap-2 text-slate-700">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-500/30" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">
            Encrypted AI Connection
          </span>
        </div>
      </div>
    </div>
  );
};

export default App;
