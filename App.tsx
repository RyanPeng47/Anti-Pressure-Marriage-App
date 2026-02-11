import React, { useState } from 'react';
import { TabBar } from './components/TabBar';
import { CardView } from './components/CardView';
import { Calculator } from './components/Calculator';
import { Dashboard } from './components/Dashboard';
import { CityPk } from './components/CityPk';
import { Tab, MarriageCostData } from './types';

function App() {
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.CARDS);
  const [costData, setCostData] = useState<MarriageCostData | null>(null);

  const handleCostCalculation = (data: MarriageCostData) => {
    setCostData(data);
    // Optional: auto switch to dashboard to see results
    // setCurrentTab(Tab.DASHBOARD);
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden max-w-md mx-auto relative border-x-2 border-black bg-white/50 backdrop-blur-sm">
      <main className="flex-1 overflow-hidden relative">
        {currentTab === Tab.CARDS && <CardView />}
        {currentTab === Tab.CALCULATOR && <Calculator onCalculate={handleCostCalculation} />}
        {currentTab === Tab.PK && <CityPk />}
        {currentTab === Tab.DASHBOARD && <Dashboard data={costData} />}
      </main>
      <TabBar currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
}

export default App;