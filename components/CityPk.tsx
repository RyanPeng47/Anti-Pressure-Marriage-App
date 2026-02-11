import React, { useState } from 'react';
import { calculateCityCosts } from '../services/geminiService';
import { MarriageCostData } from '../types';
import { Swords, Trophy, Skull, Loader2, Clock, HeartCrack, TrendingUp } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

export const CityPk: React.FC = () => {
  const [cityA, setCityA] = useState('');
  const [cityB, setCityB] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ a: MarriageCostData; b: MarriageCostData } | null>(null);

  const handleFight = async () => {
    if (!cityA.trim() || !cityB.trim()) return;
    setLoading(true);
    
    // Parallel fetching for speed
    try {
        const [dataA, dataB] = await Promise.all([
            calculateCityCosts(cityA),
            calculateCityCosts(cityB)
        ]);
        setResult({ a: dataA, b: dataB });
    } catch (e) {
        console.error(e);
    }
    setLoading(false);
  };

  const getWinner = () => {
    if (!result) return null;
    return result.a.totalCost > result.b.totalCost ? result.a : result.b;
  };

  const winner = getWinner();

  // --- Data Preparation for Visuals ---

  // 1. Radar Chart Data (Normalized 0-100)
  const calculateRadarData = () => {
    if (!result) return [];
    
    const normalize = (valA: number, valB: number) => {
        const max = Math.max(valA, valB, 1); // Avoid div by zero
        return {
            a: Math.round((valA / max) * 100),
            b: Math.round((valB / max) * 100),
            fullMark: 100
        };
    };

    const housing = normalize(result.a.housingDownPayment, result.b.housingDownPayment);
    const dowry = normalize(result.a.dowry, result.b.dowry);
    const ceremony = normalize(result.a.weddingCeremony + result.a.other, result.b.weddingCeremony + result.b.other);
    const time = normalize(result.a.timeCostHours, result.b.timeCostHours);
    const sunk = normalize(result.a.sunkCost, result.b.sunkCost);

    return [
        { subject: '买房压力', A: housing.a, B: housing.b, fullMark: 100 },
        { subject: '彩礼强度', A: dowry.a, B: dowry.b, fullMark: 100 },
        { subject: '仪式繁琐', A: ceremony.a, B: ceremony.b, fullMark: 100 },
        { subject: '时间消耗', A: time.a, B: time.b, fullMark: 100 },
        { subject: '恋爱成本', A: sunk.a, B: sunk.b, fullMark: 100 },
    ];
  };

  const radarData = calculateRadarData();

  // 2. Financial Opportunity Cost (Simple estimation: 3% annual yield loss on total capital)
  const opportunityCostA = Math.round(result?.a.totalCost ? result.a.totalCost * 0.03 : 0);
  const opportunityCostB = Math.round(result?.b.totalCost ? result.b.totalCost * 0.03 : 0);

  return (
    <div className="flex flex-col h-full p-4 overflow-y-auto pb-24 font-sans bg-slate-50">
      <header className="mb-6 text-center relative">
        <h1 className="text-4xl font-black italic tracking-tighter text-black transform -rotate-2" style={{ textShadow: '3px 3px 0px #ef4444' }}>
          🥊 城市修罗场
        </h1>
        <div className="absolute top-0 right-4 w-8 h-8 bg-black animate-spin-slow opacity-10"></div>
      </header>

      {/* Input Arena */}
      <div className="bg-white border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8 relative">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white font-black text-xl border-2 border-black rounded-full w-10 h-10 flex items-center justify-center z-10 animate-pulse">
            VS
        </div>
        
        <div className="flex gap-2 justify-between">
            <div className="flex-1">
                <label className="block text-xs font-black mb-1 bg-blue-500 text-white w-fit px-1">蓝方 (Blue)</label>
                <input 
                    type="text" 
                    value={cityA}
                    onChange={(e) => setCityA(e.target.value)}
                    placeholder="例如: 鹤岗"
                    className="w-full border-2 border-black p-2 font-bold text-center bg-blue-50 focus:bg-white outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && handleFight()}
                />
            </div>
            <div className="w-4"></div>
            <div className="flex-1">
                <label className="block text-xs font-black mb-1 bg-orange-500 text-white w-fit px-1 ml-auto">红方 (Red)</label>
                <input 
                    type="text" 
                    value={cityB}
                    onChange={(e) => setCityB(e.target.value)}
                    placeholder="例如: 深圳"
                    className="w-full border-2 border-black p-2 font-bold text-center bg-orange-50 focus:bg-white outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && handleFight()}
                />
            </div>
        </div>

        <button 
            onClick={handleFight}
            disabled={loading || !cityA || !cityB}
            className="w-full mt-4 bg-black text-yellow-400 font-black text-lg py-2 border-2 border-transparent hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
            {loading ? <Loader2 className="animate-spin" /> : <Swords className="w-5 h-5" />}
            {loading ? '正在连线AI裁判...' : '开始处刑 / FIGHT!'}
        </button>
      </div>

      {result && winner && (
        <div className="animate-slide-up space-y-8">
            
            {/* 1. The Winner (Loser?) Badge */}
            <div className="bg-red-500 border-4 border-black p-4 text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-20"></div>
                <div className="relative z-10">
                    <div className="flex justify-center mb-2">
                        <Trophy className="w-10 h-10 text-yellow-300 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]" />
                    </div>
                    <h2 className="text-2xl font-black mb-1">👑 卷王之王: {winner.city}</h2>
                    <p className="font-bold text-sm bg-black inline-block px-2 py-1 transform rotate-1">
                        在这结婚，等于给银行打工 {(winner.totalCost / 100000).toFixed(1)} 年
                    </p>
                </div>
            </div>

            {/* 2. Pentagon of Pain (Radar Chart) */}
            <div className="bg-white p-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="font-black text-black mb-2 flex items-center gap-2 border-b-2 border-black pb-2">
                    <Skull className="w-5 h-5" /> 痛苦五维图
                </h3>
                <div className="h-64 w-full text-xs font-bold relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                            <PolarGrid stroke="#000" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: 'black', fontWeight: 'bold', fontSize: 10 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar name={result.a.city} dataKey="A" stroke="#3b82f6" strokeWidth={3} fill="#3b82f6" fillOpacity={0.5} />
                            <Radar name={result.b.city} dataKey="B" stroke="#f97316" strokeWidth={3} fill="#f97316" fillOpacity={0.5} />
                            <Legend wrapperStyle={{ paddingTop: '10px', fontWeight: 'bold' }} />
                        </RadarChart>
                    </ResponsiveContainer>
                    <div className="absolute bottom-0 right-0 text-[10px] text-slate-400">*数值越大越痛苦</div>
                </div>
            </div>

            {/* 3. Hidden Costs (Invisible Bills) */}
            <div>
                <h3 className="font-black text-black mb-4 flex items-center gap-2 text-lg bg-yellow-300 w-fit px-2 border-2 border-black transform -rotate-1">
                    👻 隐形账单 (Hidden Costs)
                </h3>
                
                <div className="grid grid-cols-1 gap-4">
                    {/* Sunk Cost Comparison */}
                    <div className="bg-pink-100 border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <div className="flex items-center gap-2 mb-2">
                            <HeartCrack className="w-5 h-5 text-red-600" />
                            <span className="font-black text-sm">沉没成本 (恋爱/精神损失)</span>
                        </div>
                        <div className="flex justify-between items-end text-sm font-bold border-b border-black border-dashed pb-2 mb-2">
                            <span className="text-blue-600">{result.a.city}: ¥{result.a.sunkCost.toLocaleString()}</span>
                            <span className="text-orange-600">{result.b.city}: ¥{result.b.sunkCost.toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-tight">
                            注：包含约会吃饭、送礼、以及被对方气出结节的医药费预估。
                        </p>
                    </div>

                    {/* Time Opportunity Cost */}
                    <div className="bg-blue-100 border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-5 h-5 text-blue-600" />
                            <span className="font-black text-sm">时间机会成本 (备婚耗时)</span>
                        </div>
                        <div className="space-y-2">
                             <div className="flex justify-between items-center text-xs font-bold">
                                <span>{result.a.city}</span>
                                <div className="flex-1 mx-2 h-2 bg-white border border-black rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500" style={{width: `${Math.min((result.a.timeCostHours / 500) * 100, 100)}%`}}></div>
                                </div>
                                <span>{result.a.timeCostHours} 小时</span>
                             </div>
                             <div className="flex justify-between items-center text-xs font-bold">
                                <span>{result.b.city}</span>
                                <div className="flex-1 mx-2 h-2 bg-white border border-black rounded-full overflow-hidden">
                                    <div className="h-full bg-orange-500" style={{width: `${Math.min((result.b.timeCostHours / 500) * 100, 100)}%`}}></div>
                                </div>
                                <span>{result.b.timeCostHours} 小时</span>
                             </div>
                        </div>
                        <p className="text-xs text-slate-600 mt-2 leading-tight">
                            这些时间如果你用来送外卖，按每小时30元算，你少赚了：
                            <span className="font-black"> ¥{(Math.abs(result.a.timeCostHours - result.b.timeCostHours) * 30).toLocaleString()} </span>
                            (差值)
                        </p>
                    </div>

                    {/* Financial Opportunity Cost */}
                    <div className="bg-green-100 border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                         <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-5 h-5 text-green-700" />
                            <span className="font-black text-sm">理财收益损失 (每年)</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                             <div className="flex flex-col items-center">
                                <span className="font-black text-blue-600">¥{opportunityCostA.toLocaleString()}</span>
                                <span className="text-[10px] font-bold text-slate-500">{result.a.city}</span>
                             </div>
                             <span className="text-xs font-black text-slate-400">VS</span>
                             <div className="flex flex-col items-center">
                                <span className="font-black text-orange-600">¥{opportunityCostB.toLocaleString()}</span>
                                <span className="text-[10px] font-bold text-slate-500">{result.b.city}</span>
                             </div>
                        </div>
                        <p className="text-xs text-slate-600 mt-2 text-center">
                            *假设这笔钱存大额存单 (3%) 每年能产生的利息，这可是“睡后收入”啊！
                        </p>
                    </div>
                </div>
            </div>
            
             <div className="text-center mt-8 mb-4">
                 <p className="text-xs font-bold text-slate-400 transform rotate-1">数据越扎心，单身越安心</p>
            </div>
        </div>
      )}
    </div>
  );
};