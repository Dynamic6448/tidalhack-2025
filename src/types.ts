export interface ComponentHealth {
    name: string;
    status: 'normal' | 'caution' | 'critical';
    score: number;
}

export interface Anomaly {
    id: string;
    aircraft: string;
    component: string;
    timestamp: string;
    severity: 'high' | 'medium' | 'low';
    score: number;
    description: string;
    recommendation: string;
}

export interface Telemetry {
    egt: number;
    n1: number;
    n2: number;
    fuelFlow: number;
    vibration: number;
}

export interface UploadHistory {
    id: string;
    filename: string;
    uploadedBy: string;
    timestamp: string;
    records: number;
    status: 'success' | 'processing' | 'failed';
}

export interface GeminiResponse {
    summary: string;
    status: 'normal' | 'caution' | 'critical';
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
