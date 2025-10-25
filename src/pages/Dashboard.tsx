// pages/Dashboard.tsx
import React, { useState } from 'react';
import { 
    Gauge, 
    Activity, 
    AlertCircle, 
    CheckCircle, 
    TrendingUp 
} from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import type { Anomaly } from '../types';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Dashboard: React.FC = () => {
    const [selectedAircraft, setSelectedAircraft] = useState('AC001');

    const anomalies = [
        {
            id: 'AN001',
            timestamp: '2 mins ago',
            aircraft: 'AC001',
            component: 'Engine 1',
            severity: 'medium',
            score: 0,
            description: 'EGT trending above normal',
            recommendation: '',
        },
        {
            id: 'AN002',
            timestamp: '15 mins ago',
            aircraft: 'AC003',
            component: 'Hydraulics',
            severity: 'high',
            score: 0,
            description: 'Pressure fluctuation detected',
            recommendation: '',
        },
        {
            id: 'AN003',
            timestamp: '1 hour ago',
            aircraft: 'AC002',
            component: 'Fuel System',
            severity: 'low',
            score: 0,
            description: 'Minor flow irregularity',
            recommendation: '',
        },
    ];

    const fleetStats = {
        total: 12,
        withAnomalies: 3,
        healthScore: 87,
    };

    const engineHealthData = {
        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
        datasets: [
            {
                label: 'Health Score',
                data: [95, 93, 91, 89, 87, 88, 90],
                borderColor: '#77c1d4',
                backgroundColor: 'rgba(119, 193, 212, 0.1)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const anomalyBySystemData = {
        labels: ['Engine', 'Hydraulics', 'Electrical', 'Fuel System'],
        datasets: [
            {
                label: 'Anomalies',
                data: [8, 5, 3, 4],
                backgroundColor: [
                    '#150a82',
                    '#77c1d4',
                    '#3e4a5b',
                    '#08033d',
                ],
            },
        ],
    };

    const severityData = {
        labels: ['High', 'Medium', 'Low'],
        datasets: [
            {
                data: [2, 8, 10],
                backgroundColor: ['rgba(239, 68, 68, 0.8)', 'rgba(251, 146, 60, 0.8)', 'rgba(234, 179, 8, 0.8)'],
            },
        ],
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'high':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'medium':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'low':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    const GaugeCard: React.FC<{ label: string; value: number; unit: string; max: number; color: string }> = ({
        label,
        value,
        unit,
        max,
        color,
    }) => {
        const percentage = (value / max) * 100;

        return (
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-slate-600">{label}</h3>
                    <Gauge className="w-5 h-5 text-slate-400" />
                </div>
                <div className="relative pt-1">
                    <div className="flex items-center justify-between mb-2">
                        <span className={`text-2xl font-bold ${color}`}>{value.toFixed(1)}</span>
                        <span className="text-sm text-slate-500">{unit}</span>
                    </div>
                    <div className="overflow-hidden h-2 text-xs flex rounded-full bg-slate-100">
                        <div
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                                percentage > 90 ? 'bg-red-500' : percentage > 70 ? 'bg-orange-500' : 'bg-green-500'
                            } transition-all duration-500`}
                        ></div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-[#3e4a5b]">Fleet Overview</h1>
                <p className="text-[#3e4a5b] mt-1">Real-time monitoring and anomaly detection</p>
            </div>

            {/* Fleet Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#f0f1ff] rounded-xl p-6 border border-[#ced1e8] shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[#3e4a5b] mb-1">Total Aircraft</p>
                            <p className="text-3xl font-bold text-[#150a82]">{fleetStats.total}</p>
                        </div>
                        <div className="bg-[#ced1e8] p-3 rounded-lg">
                            <Activity className="w-8 h-8 text-[#150a82]" />
                        </div>
                    </div>
                </div>

                <div className="bg-[#f0f1ff] rounded-xl p-6 border border-[#ced1e8] shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[#3e4a5b] mb-1">With Anomalies</p>
                            <p className="text-3xl font-bold text-[#150a82]">{fleetStats.withAnomalies}</p>
                            <p className="text-xs text-[#3e4a5b] mt-1">
                                {((fleetStats.withAnomalies / fleetStats.total) * 100).toFixed(0)}% of fleet
                            </p>
                        </div>
                        <div className="bg-[#ced1e8] p-3 rounded-lg">
                            <AlertCircle className="w-8 h-8 text-[#150a82]" />
                        </div>
                    </div>
                </div>

                <div className="bg-[#f0f1ff] rounded-xl p-6 border border-[#ced1e8] shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[#3e4a5b] mb-1">Avg Health Score</p>
                            <p className="text-3xl font-bold text-[#150a82]">{fleetStats.healthScore}%</p>
                            <div className="flex items-center mt-1">
                                <TrendingUp className="w-4 h-4 text-[#77c1d4] mr-1" />
                                <p className="text-xs text-[#77c1d4]">+2.3% from last week</p>
                            </div>
                        </div>
                        <div className="bg-[#ced1e8] p-3 rounded-lg">
                            <CheckCircle className="w-8 h-8 text-[#150a82]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Aircraft Selector */}
                    <div className="bg-[#f0f1ff] rounded-xl p-6 border border-[#ced1e8] shadow-sm">
                        <label className="block text-sm font-medium text-[#3e4a5b] mb-3">
                            Select Aircraft
                        </label>
                        <select
                            value={selectedAircraft}
                            onChange={(e) => setSelectedAircraft(e.target.value)}
                            className="w-full px-4 py-3 border border-[#ced1e8] rounded-lg focus:ring-2 focus:ring-[#150a82] focus:border-transparent bg-white text-[#3e4a5b]"
                        >
                            <option value="AC001">AC001 - Boeing 737-800</option>
                            <option value="AC002">AC002 - Airbus A320</option>
                            <option value="AC003">AC003 - Boeing 787-9</option>
                        </select>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[#f0f1ff] rounded-xl p-6 border border-[#ced1e8] shadow-sm">
                            <h3 className="text-lg font-semibold text-[#3e4a5b] mb-4">Engine Health Trend</h3>
                            <div className="h-[240px]"> {/* Add fixed height container */}
                                <Line
                                    data={engineHealthData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: true,
                                        plugins: {
                                            legend: { display: false },
                                        },
                                        scales: {
                                            y: { 
                                                beginAtZero: false, 
                                                min: 80, 
                                                max: 100,
                                                grid: {
                                                    color: '#ced1e8'
                                                }
                                            },
                                            x: {
                                                grid: {
                                                    display: false
                                                }
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        <div className="bg-[#f0f1ff] rounded-xl p-6 border border-[#ced1e8] shadow-sm">
                            <h3 className="text-lg font-semibold text-[#3e4a5b] mb-4">Anomalies by System</h3>
                            <div className="h-[240px]"> {/* Add fixed height container */}
                                <Bar
                                    data={anomalyBySystemData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: true,
                                        plugins: {
                                            legend: { display: false },
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                grid: {
                                                    color: '#ced1e8'
                                                }
                                            },
                                            x: {
                                                grid: {
                                                    display: false
                                                }
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Anomalies Feed */}
                <div className="space-y-6">
                    <div className="bg-[#f0f1ff] rounded-xl border border-[#ced1e8] shadow-sm">
                        <div className="p-6 border-b border-[#ced1e8]">
                            <h3 className="text-lg font-semibold text-[#3e4a5b]">Recent Anomalies</h3>
                        </div>
                        <div className="divide-y divide-[#ced1e8]">
                            {anomalies.map((anomaly) => (
                                <div key={anomaly.id} className="p-4 hover:bg-slate-50 cursor-pointer transition">
                                    <div className="flex items-start justify-between mb-2">
                                        <span
                                            className={`px-2 py-1 text-xs font-medium rounded border ${getSeverityColor(
                                                anomaly.severity
                                            )}`}
                                        >
                                            {anomaly.severity.toUpperCase()}
                                        </span>
                                        <span className="text-xs text-slate-500">{anomaly.timestamp}</span>
                                    </div>
                                    <p className="font-medium text-slate-800 mb-1">
                                        {anomaly.aircraft} - {anomaly.component}
                                    </p>
                                    <p className="text-sm text-slate-600">{anomaly.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Severity Distribution */}
                    <div className="bg-[#f0f1ff] rounded-xl p-6 border border-[#ced1e8] shadow-sm">
                        <h3 className="text-lg font-semibold text-[#3e4a5b] mb-4">Severity Distribution</h3>
                        <div className="h-[200px] w-[200px] mx-auto"> {/* Add fixed size container */}
                            <Doughnut
                                data={severityData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: true,
                                    plugins: {
                                        legend: { 
                                            position: 'bottom',
                                            labels: {
                                                padding: 20,
                                                usePointStyle: true
                                            }
                                        }
                                    },
                                    cutout: '65%'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
