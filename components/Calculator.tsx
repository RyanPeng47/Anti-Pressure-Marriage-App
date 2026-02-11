import React, { useState } from 'react';
import { MarriageCostData, ConversionData } from '../types';
import { calculateCityCosts } from '../services/geminiService';
import { Calculator as CalcIcon, MapPin, Loader2, Frown, DollarSign } from 'lucide-react';

interface CalculatorProps {
  onCalculate: (data: MarriageCostData) => void;
}

export const Calculator: React.FC<CalculatorProps> = ({ onCalculate }) => {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MarriageCostData | null>(null);

  const handleCalculate = async () => {
    if (!city.trim()) return;
    setLoading(true);
    const data = await calculateCityCosts(city);
    setResult(data);
    onCalculate(data);
    setLoading(false);
  };

  const getConversions = (cost: number): ConversionData => ({
    cupsOfMilkTea: Math.floor(cost / 20),
    gramsOfGold: parseFloat((cost / 600).toFixed(2)),
    iphonePros: parseFloat((cost / 8000).toFixed(1)),
    monthsOfSalary: parseFloat((cost / 8000).toFixed(1)),
  });

  return (
    <div className="flex flex-col h-full p-4 overflow-y-auto pb-24">
      <header className="mb-8 mt-2">
        <h1 className="text-3xl font-black text-black uppercase tracking-tighter transform -skew-x-6 w-fit bg-pink-400 border-2 border-black px-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          💸 婚姻碎钞机
        </h1>
        <p className="text-sm font-bold text-slate-500 mt-3 ml-1">
          不算不知道，一算吓一跳
        </p>
      </header>

      <div className="bg-white p-6 border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-8">
        <label className="block text-sm font-extrabold text-black mb-3">施主欲在何处渡劫？(城市)</label>
        <div className="flex flex-col gap-4">
          <div className="relative">
            <MapPin className="absolute left-3 top-3.5 text-black w-5 h-5" />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="例如：北上广深..."
              className="w-full pl-10 pr-4 py-3 border-2 border-black rounded-none focus:bg-blue-50 focus:ring-0 outline-none font-bold text-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]"
              onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
            />
          </div>
          <button
            onClick={handleCalculate}
            disabled={loading || !city}
            className="bg-orange-500 text-white w-full py-3 border-2 border-black font-black text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all disabled:opacity-70 disabled:grayscale"
          >
            {loading ? <div className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" /> 正在疯狂按计算器...</div> : '启动毁灭程序 💥'}
          </button>
        </div>
      </div>

      {result && (
        <div className="space-y-6 animate-fade-in">
          {/* Main Receipt */}
          <div className="bg-white border-2 border-black p-0 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
             <div className="bg-black text-white p-3 font-mono font-bold text-center border-b-2 border-black flex items-center justify-center gap-2">
                <Frown className="w-5 h-5 text-yellow-400" />
                <span>受难通知书</span>
             </div>
             <div className="p-6 text-center">
                <div className="text-xs font-bold text-slate-500 mb-1 tracking-widest uppercase">{result.city} 总消费预估</div>
                <div className="text-4xl font-black text-red-600 mb-2">¥ {result.totalCost.toLocaleString()}</div>
                <div className="inline-block bg-yellow-300 border border-black px-2 py-1 text-xs font-bold transform -rotate-2">
                  需耗时: {result.timeCostHours} 小时 (≈{(result.timeCostHours/24).toFixed(1)}天)
                </div>
             </div>
             
             {/* Zigzag bottom border effect css hack */}
             <div className="h-4 bg-slate-100 border-t-2 border-black" style={{backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%)', backgroundSize: '10px 10px', backgroundColor: '#fff', backgroundPosition: '0 0, 0 5px'}}></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ConversionCard 
               label="奶茶坟墓" 
               value={`${getConversions(result.totalCost).cupsOfMilkTea.toLocaleString()}`} 
               unit="杯"
               desc="喝到胰岛素抵抗"
               color="bg-green-300"
            />
            <ConversionCard 
               label="黄金枷锁" 
               value={`${getConversions(result.totalCost).gramsOfGold}`} 
               unit="克"
               desc="脖子都要压断了"
               color="bg-yellow-300"
            />
             <ConversionCard 
               label="苹果堆成山" 
               value={`${getConversions(result.totalCost).iphonePros}`} 
               unit="台"
               desc="Pro Max 随便摔"
               color="bg-blue-300"
            />
            <ConversionCard 
               label="恋爱智商税" 
               value={`¥${(result.sunkCost/1000).toFixed(1)}k`} 
               unit=""
               desc="之前的钱都喂狗了"
               color="bg-pink-300"
            />
          </div>

          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5">
            <h3 className="font-black text-black mb-4 flex items-center gap-2 text-lg">
                <DollarSign className="w-6 h-6 bg-black text-white rounded-full p-1" />
                剁手清单
            </h3>
            <ul className="space-y-3 font-mono text-sm">
                <CostItem label="🏠 房产首付" value={result.housingDownPayment} total={result.totalCost} color="bg-blue-500" />
                <CostItem label="🧧 天价彩礼" value={result.dowry} total={result.totalCost} color="bg-red-500" />
                <CostItem label="🎭 婚礼表演" value={result.weddingCeremony} total={result.totalCost} color="bg-purple-500" />
                <CostItem label="💍 闪瞎狗眼" value={result.jewelry} total={result.totalCost} color="bg-yellow-400" />
                <CostItem label="✈️ 蜜月打卡" value={result.honeymoon} total={result.totalCost} color="bg-green-500" />
                <CostItem label="🗑️ 其他杂费" value={result.other} total={result.totalCost} color="bg-slate-500" />
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

const ConversionCard = ({ label, value, unit, desc, color }: { label: string, value: string, unit: string, desc: string, color: string }) => (
  <div className={`p-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between ${color} hover:rotate-1 transition-transform`}>
    <span className="text-xs font-black uppercase border-b-2 border-black w-fit mb-2">{label}</span>
    <div className="font-black text-xl leading-none">{value}<span className="text-sm ml-1">{unit}</span></div>
    <span className="text-[10px] font-bold mt-1 opacity-80">{desc}</span>
  </div>
);

const CostItem = ({ label, value, total, color }: { label: string, value: number, total: number, color: string }) => {
    const percent = Math.round((value / total) * 100);
    return (
        <li className="flex flex-col">
            <div className="flex justify-between items-end mb-1">
                <span className="font-bold">{label}</span>
                <span className="font-bold">¥{value.toLocaleString()}</span>
            </div>
            <div className="w-full h-3 bg-white border-2 border-black rounded-full overflow-hidden relative">
                <div className={`h-full ${color} absolute top-0 left-0 border-r-2 border-black`} style={{ width: `${percent}%` }} />
            </div>
        </li>
    );
}