export interface SoilData {
  moisture: number;
  ph: number;
  nitrogen: 'Low' | 'Medium' | 'High';
  phosphorus: 'Low' | 'Medium' | 'High';
  potassium: 'Low' | 'Medium' | 'High';
  lastUpdated: string;
}

export type GrowthStage = 'germination' | 'vegetative' | 'flowering' | 'ripening' | 'harvest';

export interface CropHealth {
  id: string;
  fieldId: string;
  date: string;
  healthScore: number; // 0-100
  issues: string[];
  images: string[]; // URLs of crop images
  notes: string;
}

export interface GrowthData {
  id: string;
  fieldId: string;
  date: string;
  stage: GrowthStage;
  height: number; // in cm
  density: number; // plants per square meter
  images: string[];
  notes: string;
}

export interface YieldPrediction {
  id: string;
  fieldId: string;
  date: string;
  predictedYield: number; // in tons per hectare
  confidence: number; // 0-100
  factors: {
    weather: number;
    soil: number;
    pests: number;
    disease: number;
  };
}

export type AnalysisType = 'soil' | 'crop' | 'pest' | 'disease';

export interface SoilAnalysis {
  id: string;
  fieldId: string;
  date: string;
  moisture: number;
  ph: number;
  nutrients: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    organic: number;
  };
  texture: {
    sand: number;
    silt: number;
    clay: number;
  };
  temperature: number;
  compaction: number;
  recommendations: string[];
  images: string[];
}

export interface CropAnalysis {
  id: string;
  fieldId: string;
  date: string;
  healthScore: number;
  growth: {
    height: number;
    density: number;
    stage: string;
    uniformity: number;
  };
  stress: {
    water: number;
    nutrient: number;
    temperature: number;
  };
  diseases: Array<{
    name: string;
    severity: number;
    affectedArea: number;
  }>;
  pests: Array<{
    type: string;
    severity: number;
    population: 'low' | 'medium' | 'high';
  }>;
  images: string[];
  recommendations: string[];
}

export interface AnalysisReport {
  id: string;
  fieldId: string;
  date: string;
  type: AnalysisType;
  soilAnalysis?: SoilAnalysis;
  cropAnalysis?: CropAnalysis;
  summary: string;
  status: 'pending' | 'completed' | 'failed';
  recommendations: string[];
}

export interface AnalysisHistory {
  id: string;
  type: 'soil' | 'crop';
  date: string;
  findings: string;
  recommendations: string[];
}

export interface SavedAnalysis {
  id: string;
  type: 'soil' | 'crop';
  date: string;
  imageUri: string;
  results: {
    label: string;
    value: number;
    status: 'good' | 'warning' | 'error';
  }[];
  recommendations: string[];
} 