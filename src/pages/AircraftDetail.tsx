// pages/AircraftDetail.tsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, Activity, AlertTriangle, Wrench } from 'lucide-react';
import { Line } from 'react-chartjs-2';

interface ComponentHealth {
    name: string;
    status: 'normal' | 'caution' | 'critical';
    score: number;
}

const AircraftDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const [aircraftInfo] = useState({
        id: id || 'AC001',
        type: 'Boeing 737-800',
        tailNumber: 'N12345',
        totalFlightHours: 24567,
        flightCycles: 18234,
        lastMaintenance: '2024-01-15',
        healthScore: 87,
    });

    const [selectedMetric, setSelectedMetric] = useState<'egt' | 'vibration' | 'fuel'>('egt');

    const [components] = useState<ComponentHealth[]>([
        { name: 'Engine 1', status: 'caution', score: 82 },
        { name: 'Engine 2', status: 'normal', score: 94 },
        { name: 'Hydraulics', status: 'normal', score: 91 },
        { name: 'Electrical', status: 'normal', score: 96 },
        { name: 'Fuel System', status: 'normal', score: 89 },
        { name: 'Landing Gear', status: 'critical', score: 76 },
    ]);

    const anomaliesHistory = [
        {
            timestamp: '2024-01-20 14:32',
            component: 'Engine 1',
            severity: 'medium',
            description: 'EGT trending above normal range',
            recommendation: 'Schedule inspection within 100 flight hours. Check combustion chamber and fuel nozzles.',
        },
        {
            timestamp: '2024-01-19 09:15',
            component: 'Landing Gear',
            severity: 'high',
            description: 'Hydraulic pressure drop detected',
            recommendation: 'Immediate inspection required. Check for leaks and seal integrity.',
        },
        {
            timestamp: '2024-01-18 16:45',
            component: 'Engine 1',
            severity: 'low',
            description: 'Minor vibration increase',
            recommendation: 'Monitor during next 5 flights. Consider fan blade inspection.',
        },
    ];

    const metricsData = {
        egt: {
            labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
            datasets: [
                {
                    label: 'EGT (°C)',
                    data: Array.from({ length: 24 }, () => 600 + Math.random() * 100),
                    borderColor: 'rgb(251, 146, 60)',
                    backgroundColor: 'rgba(251, 146, 60, 0.1)',
                    fill: true,
                    tension: 0.4,
                },
            ],
        },
        vibration: {
            labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
            datasets: [
                {
                    label: 'Vibration (g)',
                    data: Array.from({ length: 24 }, () => 0.2 + Math.random() * 0.3),
                    borderColor: 'rgb(139, 92, 246)',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    fill: true,
                    tension: 0.4,
                },
            ],
        },
        fuel: {
            labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
            datasets: [
                {
                    label: 'Fuel Flow (kg/h)',
                    data: Array.from({ length: 24 }, () => 2200 + Math.random() * 400),
                    borderColor: 'rgb(34, 197, 94)',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    fill: true,
                    tension: 0.4,
                },
            ],
        },
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'normal':
                return 'bg-green-500';
            case 'caution':
                return 'bg-orange-500';
            case 'critical':
                return 'bg-red-500';
            default:
                return 'bg-slate-500';
        }
    };

    const getHealthColor = (score: number) => {
        if (score >= 90) return 'text-green-600';
        if (score >= 75) return 'text-orange-600';
        return 'text-red-600';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">{aircraftInfo.id}</h1>
                        <p className="text-slate-600 mt-1">
                            {aircraftInfo.type} • {aircraftInfo.tailNumber}
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-slate-600">Overall Health Score</span>
                            <span className={`text-4xl font-bold ${getHealthColor(aircraftInfo.healthScore)}`}>
                                {aircraftInfo.healthScore}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                    <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-600">Flight Hours</p>
                            <p className="text-lg font-semibold text-slate-800">
                                {aircraftInfo.totalFlightHours.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="bg-purple-100 p-2 rounded-lg">
                            <Activity className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-600">Flight Cycles</p>
                            <p className="text-lg font-semibold text-slate-800">
                                {aircraftInfo.flightCycles.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                            <Calendar className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-600">Last Maintenance</p>
                            <p className="text-lg font-semibold text-slate-800">{aircraftInfo.lastMaintenance}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="bg-orange-100 p-2 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-600">Active Anomalies</p>
                            <p className="text-lg font-semibold text-slate-800">3</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Telemetry Charts */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-slate-800">Telemetry Data (Last 24 Hours)</h2>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setSelectedMetric('egt')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                selectedMetric === 'egt'
                                    ? 'bg-orange-100 text-orange-700'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            EGT
                        </button>
                        <button
                            onClick={() => setSelectedMetric('vibration')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                selectedMetric === 'vibration'
                                    ? 'bg-purple-100 text-purple-700'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            Vibration
                        </button>
                        <button
                            onClick={() => setSelectedMetric('fuel')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                selectedMetric === 'fuel'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            Fuel Flow
                        </button>
                    </div>
                </div>
                <Line
                    data={metricsData[selectedMetric]}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                mode: 'index',
                                intersect: false,
                            },
                        },
                        interaction: {
                            mode: 'nearest',
                            axis: 'x',
                            intersect: false,
                        },
                    }}
                />
            </div>

            {/* Component Health & Anomalies */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Component Health Visual */}
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <h2 className="text-xl font-semibold text-slate-800 mb-6">Component Health</h2>
                    <div className="space-y-4">
                        {components.map((component, index) => (
                            <div key={index} className="group">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className={`w-3 h-3 rounded-full ${getStatusColor(component.status)}`}
                                        ></div>
                                        <span className="font-medium text-slate-700">{component.name}</span>
                                    </div>
                                    <span className={`text-sm font-semibold ${getHealthColor(component.score)}`}>
                                        {component.score}%
                                    </span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-300 ${
                                            component.status === 'normal'
                                                ? 'bg-green-500'
                                                : component.status === 'caution'
                                                ? 'bg-orange-500'
                                                : 'bg-red-500'
                                        }`}
                                        style={{ width: `${component.score}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Anomalies Table */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-200">
                        <h2 className="text-xl font-semibold text-slate-800">Anomaly History</h2>
                    </div>
                    <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                        {anomaliesHistory.map((anomaly, index) => (
                            <div key={index} className="p-4 hover:bg-slate-50 cursor-pointer transition group">
                                <div className="flex items-start justify-between mb-2">
                                    <span
                                        className={`px-2 py-1 text-xs font-medium rounded ${
                                            anomaly.severity === 'high'
                                                ? 'bg-red-100 text-red-700'
                                                : anomaly.severity === 'medium'
                                                ? 'bg-orange-100 text-orange-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                        }`}
                                    >
                                        {anomaly.severity.toUpperCase()}
                                    </span>
                                    <span className="text-xs text-slate-500">{anomaly.timestamp}</span>
                                </div>
                                <p className="font-medium text-slate-800 mb-1">{anomaly.component}</p>
                                <p className="text-sm text-slate-600 mb-3">{anomaly.description}</p>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 group-hover:bg-blue-100 transition">
                                    <div className="flex items-start space-x-2">
                                        <Wrench className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs font-medium text-blue-800 mb-1">Recommended Action</p>
                                            <p className="text-xs text-blue-700">{anomaly.recommendation}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Aircraft Schematic */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-800 mb-6">Aircraft System Overview</h2>
                <div className="relative bg-gradient-to-b from-slate-50 to-slate-100 rounded-xl p-8 min-h-[300px] flex items-center justify-center">
                    <div className="relative w-full max-w-3xl">
                        {/* Simplified aircraft schematic */}
                        <svg viewBox="0 0 800 300" className="w-full h-auto">
                            {/* Fuselage */}
                            <ellipse
                                cx="400"
                                cy="150"
                                rx="200"
                                ry="50"
                                fill="#cbd5e1"
                                stroke="#64748b"
                                strokeWidth="2"
                            />

                            {/* Wings */}
                            <rect
                                x="200"
                                y="145"
                                width="400"
                                height="10"
                                fill="#94a3b8"
                                stroke="#64748b"
                                strokeWidth="2"
                            />

                            {/* Engine 1 - Caution */}
                            <g onClick={() => {}} className="cursor-pointer hover:opacity-80 transition">
                                <circle cx="250" cy="150" r="30" fill="#fb923c" stroke="#ea580c" strokeWidth="3" />
                                <text x="250" y="155" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                                    ENG1
                                </text>
                                <circle cx="250" cy="120" r="5" fill="#ea580c" className="animate-pulse" />
                            </g>

                            {/* Engine 2 - Normal */}
                            <g onClick={() => {}} className="cursor-pointer hover:opacity-80 transition">
                                <circle cx="550" cy="150" r="30" fill="#22c55e" stroke="#16a34a" strokeWidth="3" />
                                <text x="550" y="155" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                                    ENG2
                                </text>
                            </g>

                            {/* Landing Gear - Critical */}
                            <g onClick={() => {}} className="cursor-pointer hover:opacity-80 transition">
                                <rect
                                    x="385"
                                    y="200"
                                    width="30"
                                    height="40"
                                    fill="#ef4444"
                                    stroke="#dc2626"
                                    strokeWidth="2"
                                    rx="5"
                                />
                                <text x="400" y="225" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
                                    GEAR
                                </text>
                                <circle cx="430" cy="220" r="5" fill="#dc2626" className="animate-pulse" />
                            </g>

                            {/* Tail */}
                            <path
                                d="M 550 145 L 650 120 L 650 180 L 550 155 Z"
                                fill="#94a3b8"
                                stroke="#64748b"
                                strokeWidth="2"
                            />
                        </svg>
                    </div>
                </div>
                <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full bg-green-500"></div>
                        <span className="text-slate-600">Normal</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                        <span className="text-slate-600">Caution</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full bg-red-500"></div>
                        <span className="text-slate-600">Critical</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AircraftDetail;
