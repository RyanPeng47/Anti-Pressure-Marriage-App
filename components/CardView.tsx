import React, { useState } from 'react';
import { QuoteCardData } from '../types';
import { generateWittyComeback, defaultQuotes } from '../services/geminiService';
import { RefreshCw, Zap, Skull, Bomb } from 'lucide-react';

export const CardView: React.FC = () => {
  const [cards, setCards] = useState<QuoteCardData[]>(defaultQuotes);
  const [flippedId, setFlippedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [customQuote, setCustomQuote] = useState("");

  const handleFlip = (id: string) => {
    setFlippedId(flippedId === id ? null : id);
  };

  const handleGenerate = async () => {
    if (!customQuote.trim()) return;
    setLoading(true);
    const comeback = await generateWittyComeback(customQuote);
    const newCard: QuoteCardData = {
      id: Date.now().toString(),
      quote: customQuote,
      comeback: comeback,
      category: 'funny'
    };
    setCards([newCard, ...cards]);
    setCustomQuote("");
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full p-4 overflow-y-auto pb-24 font-sans">
      <header className="mb-6 relative">
        <div className="absolute -top-4 -left-4 w-12 h-12 bg-yellow-300 rounded-full blur-xl opacity-70 animate-pulse"></div>
        <h1 className="text-3xl font-black text-black italic -rotate-2 relative z-10" style={{ textShadow: '2px 2px 0px #fff' }}>
          🧨 嘴替战场
        </h1>
        <p className="text-sm font-bold text-slate-600 mt-2 bg-white inline-block px-2 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rotate-1">
          专治各种 "为你好"
        </p>
      </header>

      {/* Input Area */}
      <div className="bg-white p-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
        <label className="block text-sm font-extrabold text-black mb-2 flex items-center gap-2">
            <Bomb className="w-4 h-4" /> 
            亲戚又放什么屁了？
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={customQuote}
            onChange={(e) => setCustomQuote(e.target.value)}
            placeholder="输入听了想打人的话..."
            className="flex-1 px-4 py-3 border-2 border-black bg-slate-50 focus:bg-yellow-50 focus:ring-0 outline-none text-sm font-bold shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.1)] placeholder:text-slate-400"
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !customQuote}
            className="bg-black text-white border-2 border-black px-4 py-2 flex items-center gap-2 text-sm font-bold shadow-[4px_4px_0px_0px_#a855f7] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#a855f7] active:shadow-none transition-all disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loading ? <RefreshCw className="animate-spin w-5 h-5" /> : <Zap className="w-5 h-5 text-yellow-300 fill-current" />}
            {loading ? '憋大招' : '开怼'}
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="space-y-8">
        {cards.map((card, index) => (
          <div 
            key={card.id} 
            className={`relative h-64 w-full perspective-1000 group cursor-pointer ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'} transition-transform hover:scale-[1.02] active:scale-[0.98]`} 
            onClick={() => handleFlip(card.id)}
          >
            <div className={`relative w-full h-full text-center transition-transform duration-500 transform-style-3d ${flippedId === card.id ? 'rotate-y-180' : ''}`}>
              
              {/* Front (Attack) */}
              <div className="absolute w-full h-full backface-hidden rotate-y-0 bg-white border-4 border-black p-6 flex flex-col justify-between shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                 <div className="flex justify-between items-start border-b-2 border-dashed border-black pb-3">
                    <span className="bg-red-500 text-white border-2 border-black text-xs font-black px-2 py-1 transform -rotate-3">⚠️ 敌方火力</span>
                    <span className="font-mono text-xs font-bold text-slate-400">NO.{cards.length - index}</span>
                 </div>
                 <div className="flex-1 flex items-center justify-center">
                   <h3 className="text-xl font-black text-slate-900 leading-snug">"{card.quote}"</h3>
                 </div>
                 <div className="text-right">
                    <span className="inline-block text-xs font-bold bg-black text-white px-2 py-1 animate-bounce">
                        点击反击 👊
                    </span>
                 </div>
              </div>

              {/* Back (Defense) */}
              <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-yellow-400 border-4 border-black p-6 flex flex-col justify-between shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex justify-between items-start border-b-2 border-black pb-3">
                    <span className="bg-green-500 text-white border-2 border-black text-xs font-black px-2 py-1 transform rotate-2">🔥 暴击伤害</span>
                    <Skull className="w-5 h-5" />
                 </div>
                 <div className="flex-1 flex items-center justify-center">
                   <p className="text-lg font-bold text-black leading-relaxed font-mono">{card.comeback}</p>
                 </div>
                 <div className="text-black/60 text-xs font-bold text-center border-t-2 border-black pt-2">
                    K.O. !!!
                 </div>
              </div>
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};