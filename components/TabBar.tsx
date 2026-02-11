import React from 'react';
import { Tab } from '../types';
import { MessageSquareQuote, Calculator, BarChart3, Swords } from 'lucide-react';

interface TabBarProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: Tab.CARDS, label: '怼人神器', icon: MessageSquareQuote },
    { id: Tab.CALCULATOR, label: '不想算了', icon: Calculator },
    { id: Tab.PK, label: '修罗场', icon: Swords },
    { id: Tab.DASHBOARD, label: '人间清醒', icon: BarChart3 },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full pb-safe pt-4 px-4 pb-4 z-50 pointer-events-none">
      <div className="max-w-md mx-auto flex justify-between pointer-events-auto gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 h-16 transition-all duration-200 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none ${
                isActive 
                  ? 'bg-yellow-400 translate-y-[-4px] translate-x-[-2px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]' 
                  : 'bg-white hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'stroke-2 text-black' : 'stroke-1.5 text-slate-500'}`} />
              <span className={`text-[10px] font-black mt-1 ${isActive ? 'text-black' : 'text-slate-500'}`}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};