export type Weather = 'Sunny' | 'Partly Cloudy' | 'Overcast' | 'Rainy' | 'Snowy';
export type WaterClarity = 'Clear' | 'Stained' | 'Muddy' | 'Murky';

export interface FishingConditions {
  targetSpecies: string;
  weather: Weather;
  waterTemp: number; // in Fahrenheit
  waterClarity: WaterClarity;
  location?: string;
  timeOfDay: string;
}

export interface BaitRecommendation {
  name: string;
  type: 'Natural' | 'Artificial';
  reasoning: string;
  howToUse: string;
  confidence: number; // 0 to 1
}

export interface AIRecoveredBait {
  recommendations: BaitRecommendation[];
  proTip: string;
}
