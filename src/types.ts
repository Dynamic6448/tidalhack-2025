export interface ComponentHealth {
    name: string;
    status: 'normal' | 'caution' | 'critical';
    score: number;
}

export interface Anomaly {
    id: string;
    aircraft: string;
    response: GeminiResponse;
}

export interface Telemetry {
    egt: number;
    n1: number;
    n2: number;
    fuelFlow: number;
    vibration: number;
}

export interface GeminiResponse {
    component: string;
    severity: 'normal' | 'caution' | 'critical';
    description: string;
    recommendation: string;
    score: number;
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
