/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/Anomalies.tsx
import React, { useEffect, useState } from 'react';
import { Download, Search, FileText, Send } from 'lucide-react';
import type { Anomaly } from '../types';

const Anomalies: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [severityFilter, setSeverityFilter] = useState<string>('all');
    const [systemFilter, setSystemFilter] = useState<string>('all');

    const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
    useEffect(() => {
        const fetchAnomalies = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/analyses');
                if (!res.ok) throw new Error('Failed to fetch anomalies');
                const data = await res.json();
                const anomalies: Anomaly[] = [];
                data.analyses.forEach((analysis: any, index: number) => {
                    const anomaly: Anomaly = {
                        response: analysis,
                        id: `ANOM${(index + 1).toString().padStart(4, '0')}`,
                        aircraft: `N54321`,
                    };
                    anomalies.push(anomaly);
                });
                setAnomalies(anomalies);
                console.log(anomalies);
            } catch (err) {
                console.error(err);
            }
        };
        fetchAnomalies();
    }, []);

    const filteredAnomalies = anomalies.filter((anomaly) => {
        const matchesSearch =
            anomaly.aircraft.toLowerCase().includes(searchTerm.toLowerCase()) ||
            anomaly.response.component.toLowerCase().includes(searchTerm.toLowerCase()) ||
            anomaly.response.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSeverity = severityFilter === 'all' || anomaly.response.severity === severityFilter;
        const matchesSystem =
            systemFilter === 'all' || anomaly.response.component.toLowerCase().includes(systemFilter.toLowerCase());
        return matchesSearch && matchesSeverity && matchesSystem;
    });

    const getSeverityColor = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'critical':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'caution':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'normal':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    const handleExport = (format: 'csv' | 'pdf') => {
        alert(`Exporting ${filteredAnomalies.length} anomalies as ${format.toUpperCase()}...`);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Anomaly Detection & Insights</h1>
                <p className="text-slate-600 mt-1">AI-powered maintenance recommendations</p>
            </div>

            {/* Analytics Cards */}
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-medium text-slate-600 mb-4">Severity Distribution</h3>
                    <Pie
                        data={severityDistribution}
                        options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }}
                    />
                </div>

                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm md:col-span-2">
                    <h3 className="text-sm font-medium text-slate-600 mb-4">Anomalies by Aircraft</h3>
                    <Bar
                        data={aircraftDistribution}
                        options={{
                            responsive: true,
                            plugins: { legend: { display: false } },
                        }}
                    />
                </div>
            </div> */}

            {/* Filters & Search */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by aircraft, component, or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="flex space-x-3">
                        <select
                            value={severityFilter}
                            onChange={(e) => setSeverityFilter(e.target.value)}
                            className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Severities</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>

                        <select
                            value={systemFilter}
                            onChange={(e) => setSystemFilter(e.target.value)}
                            className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Systems</option>
                            <option value="engine">Engine</option>
                            <option value="hydraulic">Hydraulic</option>
                            <option value="fuel">Fuel</option>
                            <option value="electrical">Electrical</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                    <p className="text-sm text-slate-600">
                        Showing <span className="font-semibold">{filteredAnomalies.length}</span> of{' '}
                        <span className="font-semibold">{anomalies.length}</span> anomalies
                    </p>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleExport('csv')}
                            className="flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                        >
                            <Download className="w-4 h-4" />
                            <span className="text-sm">CSV</span>
                        </button>
                        <button
                            onClick={() => handleExport('pdf')}
                            className="flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                        >
                            <FileText className="w-4 h-4" />
                            <span className="text-sm">PDF</span>
                        </button>
                        <button
                            onClick={() => alert('Slack notification sent!')}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                        >
                            <Send className="w-4 h-4" />
                            <span className="text-sm">Notify</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Anomalies Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                                    Aircraft
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                                    Component
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                                    Severity
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                                    Score
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredAnomalies.map((anomaly) => (
                                <React.Fragment key={anomaly.id}>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                            {anomaly.aircraft}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                            {anomaly.response.component}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-3 py-1 text-xs font-medium rounded-full border ${getSeverityColor(
                                                    anomaly.response.severity
                                                )}`}
                                            >
                                                {anomaly.response.severity.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">
                                            {anomaly.response.score}
                                        </td>
                                    </tr>
                                    <tr className="bg-slate-50">
                                        <td colSpan={7} className="px-6 py-4">
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-xs font-medium text-slate-600 mb-1">
                                                        Description
                                                    </p>
                                                    <p className="text-sm text-slate-800">
                                                        {anomaly.response.description}
                                                    </p>
                                                </div>
                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                                    <p className="text-xs font-medium text-blue-800 mb-1">
                                                        AI-Generated Recommendation
                                                    </p>
                                                    <p className="text-sm text-blue-700">
                                                        {anomaly.response.recommendation}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Anomalies;
