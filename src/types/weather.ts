export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  condition: 'clear' | 'cloudy' | 'rain' | 'storm';
  timestamp: string;
}

export interface WeatherForecast {
  hourly: WeatherData[];
  daily: {
    date: string;
    high: number;
    low: number;
    condition: WeatherData['condition'];
    precipitation: number;
  }[];
}

export interface WeatherAlert {
  id: string;
  type: 'storm' | 'frost' | 'drought' | 'pest';
  severity: 'low' | 'medium' | 'high';
  message: string;
  startDate: string;
  endDate: string;
  affectedFields: string[]; // field IDs
} 