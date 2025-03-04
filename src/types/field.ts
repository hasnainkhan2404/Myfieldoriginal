export interface FieldCoordinate {
  latitude: number;
  longitude: number;
}

export interface Field {
  id: string;
  name: string;
  cropType: string;
  area: number;
  plantingDate: string;
  lastInspection: string;
  boundaries: {
    latitude: number;
    longitude: number;
  }[];
  status: 'active' | 'harvested' | 'fallow';
  soilType: string;
  irrigationMethod: string;
  notes?: string;
  expectedHarvestDate?: string;
  previousCrop?: string;
  fertilizers?: {
    name: string;
    applicationDate: string;
    amount: number;
  }[];
  pesticides?: {
    name: string;
    applicationDate: string;
    amount: number;
  }[];
}

export interface FieldMarker {
  id: string;
  fieldId: string;
  type: 'issue' | 'note' | 'task';
  coordinate: FieldCoordinate;
  title: string;
  description: string;
  date: string;
  status: 'pending' | 'resolved';
} 