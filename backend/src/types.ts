export interface GeminiResponse {
    summary: string;
    status: 'Nominal' | 'Caution' | 'Warning';
    anomalies: string[];
    recommendations: string[];
}
