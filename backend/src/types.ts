export interface GeminiResponse {
    summary: string;
    status: 'Nominal' | 'Caution' | 'Warning';
    anomalies: string[];
    recommendations: string[];
}

export interface AircraftType {
    id: string;
    registration: string;
    type: string;
    totalFlightHours: number;
    flightCycles: number;
    lastMaintenance: string;
    skyScore: number;
    status: 'normal' | 'caution' | 'critical';
}
