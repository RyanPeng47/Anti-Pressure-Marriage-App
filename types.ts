export enum Tab {
  CARDS = 'cards',
  CALCULATOR = 'calculator',
  PK = 'pk',
  DASHBOARD = 'dashboard'
}

export interface QuoteCardData {
  id: string;
  quote: string; // The annoying question
  comeback: string; // The witty reply
  category: 'direct' | 'passive-aggressive' | 'philosophical' | 'funny';
}

export interface MarriageCostData {
  city: string;
  totalCost: number;
  housingDownPayment: number;
  weddingCeremony: number;
  dowry: number; // Caili
  jewelry: number;
  honeymoon: number;
  other: number;
  timeCostHours: number; // Preparation time
  sunkCost: number; // Dating expenses, emotional damage
}

export interface ConversionData {
  cupsOfMilkTea: number; // @ 20 CNY
  gramsOfGold: number; // @ 600 CNY
  iphonePros: number; // @ 8000 CNY
  monthsOfSalary: number; // Based on avg salary
}

export interface ChartDataPoint {
  name: string;
  value: number;
  fill?: string;
}