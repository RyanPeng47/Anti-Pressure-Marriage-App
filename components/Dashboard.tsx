import React from 'react';
import { MarriageCostData } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Share2, AlertTriangle, Ghost } from 'lucide-react';

interface DashboardProps {
  data: MarriageCostData | null;
}

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-8 text-center font-sans">
        <div className="bg-white border-2 border-black p-8 rounded-full shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-6 animate-bounce">
            <Ghost className="w-12 h-12 text-black" />
        </div>
        <h2 className="text-2xl font-black text-black mb-2 bg-yellow-300 inline-block px-2 border-2 border-black transform -rotate-1">暂无惨剧数据</h2>
        <p className="text-slate-600 font-bold mt-4">请先去“算算账”页面<br/>看看自己有多穷</p>
      </div>
    );
  }

  const pieData = [
    { name: '首付', value: data.housingDownPayment },
    { name: '彩礼', value: data.dowry },
    { name: '婚礼', value: data.weddingCeremony },
    { name: '首饰', value: data.jewelry },
    { name: '蜜月', value: data.honeymoon },
    { name: '其他', value: data.other },
  ].filter(i => i.value > 0);

  // High contrast retro colors
  const COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#000000'];

  return (
    <div className="flex flex-col h-full p-4 overflow-y-auto pb-24 font-sans">
      <header className="mb-6 flex justify-between items-end">
        <div>
            <h1 className="text-2xl font-black text-black border-b-4 border-black inline-block tracking-tighter">☠️ 人财两空看板</h1>
            <p className="text-xs font-bold bg-black text-white px-2 py-1 mt-1 w-fit transform -rotate-1">用魔法打败魔法</p>
        </div>
        <button className="bg-white text-black border-2 border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-none">
            <Share2 className="w-5 h-5" />
        </button>
      </header>

      {/* Main Stats (Blue Box) */}
      <div className="bg-blue-400 border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-8 relative">
        <div className="absolute -right-4 -top-8 text-[10rem] opacity-10 font-black text-white select-none pointer-events-none rotate-12">💸</div>
        
        <div className="mb-6">
            <h3 className="text-sm font-black text-white border-2 border-black bg-black inline-block px-3 py-1 transform -rotate-2 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.4)]">
                扎心指数 (KPI)
            </h3>
        </div>
        
        <div className="grid grid-cols-2 gap-5 relative z-10 px-1">
            <div className="bg-white border-2 border-black p-3 text-center transform rotate-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:rotate-0 transition-transform">
                <div className="text-2xl font-black text-black leading-none mb-1">{(data.totalCost / 10000).toFixed(1)}w</div>
                <div className="text-[10px] font-bold bg-yellow-300 text-black px-1 inline-block border border-black">钞能力消耗</div>
            </div>
            <div className="bg-white border-2 border-black p-3 text-center transform -rotate-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:rotate-0 transition-transform">
                <div className="text-2xl font-black text-black leading-none mb-1">{data.timeCostHours}h</div>
                <div className="text-[10px] font-bold bg-pink-300 text-black px-1 inline-block border border-black">生命浪费</div>
            </div>
        </div>
      </div>

      {/* Cost Distribution Chart */}
      <div className="bg-white p-5 border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-8 flex flex-col">
         <div className="mb-2">
            <h3 className="text-md font-black text-black bg-green-300 inline-block px-2 py-1 border-2 border-black transform -rotate-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                钱都去哪了?
            </h3>
         </div>
         
         <div className="h-64 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="#000"
                    strokeWidth={2}
                >
                    {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip 
                    formatter={(value: number) => `¥${value.toLocaleString()}`}
                    contentStyle={{ borderRadius: '0px', border: '2px solid black', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)', fontWeight: 'bold', fontFamily: 'monospace' }}
                    itemStyle={{ color: '#000' }}
                />
                </PieChart>
            </ResponsiveContainer>
         </div>
         
         {/* Custom Legend - Flex container to fix layout issues */}
         <div className="flex flex-wrap gap-2 justify-center mt-2 text-xs font-bold">
            {pieData.map((entry, index) => (
                <div key={index} className="flex items-center gap-1.5 border-2 border-black px-2 py-1 bg-slate-50 hover:bg-white transition-colors">
                    <div className="w-3 h-3 border border-black" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    {entry.name}
                </div>
            ))}
         </div>
      </div>

      {/* Shareable Summary Card */}
      <div className="bg-yellow-400 border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
        <div className="flex items-center gap-3 mb-5 border-b-2 border-black pb-3 border-dashed">
            <AlertTriangle className="w-8 h-8 text-black fill-white stroke-2" />
            <div className="font-black text-xl text-black tracking-tighter">⚠️ 结婚劝退书</div>
        </div>
        
        <div className="font-mono text-sm font-bold text-black leading-relaxed">
            <div className="mb-4">
                经AI精密计算，在 <span className="bg-white px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mx-1">{data.city}</span> 结一次婚：
            </div>
            
            <ul className="space-y-4 pl-1">
                <li className="flex items-center gap-2">
                    <span className="text-xl">👉</span>
                    <span>
                        等于白干 <span className="bg-black text-white px-1.5 py-0.5 transform rotate-1 inline-block border border-white">{(data.totalCost / 8000).toFixed(1)}</span> 个月
                    </span>
                </li>
                <li className="flex items-center gap-2">
                    <span className="text-xl">👉</span>
                    <span>
                        痛失 <span className="bg-black text-white px-1.5 py-0.5 transform -rotate-1 inline-block border border-white">{(data.totalCost / 20).toFixed(0)}</span> 杯续命奶茶
                    </span>
                </li>
                <li className="flex items-center gap-2">
                    <span className="text-xl">👉</span>
                    <span>
                        约等于 <span className="bg-black text-white px-1.5 py-0.5 transform rotate-1 inline-block border border-white">{(data.totalCost / 600).toFixed(1)}</span> 克黄金直接蒸发
                    </span>
                </li>
            </ul>
        </div>

        <div className="pt-8 flex justify-center">
             <div className="text-xs font-black border-2 border-black bg-white px-3 py-2 transform -rotate-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:scale-105 transition-transform cursor-cell">
                此图一出，亲戚闭嘴 🤐
             </div>
        </div>
      </div>

    </div>
  );
};