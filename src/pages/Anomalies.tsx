// pages/Anomalies.tsx
import React, { useState } from 'react';
import { Search, Download, FileText, Send } from 'lucide-react';

interface Anomaly {
    id: string;
    aircraftId: string;
    system: string;
    severity: 'high' | 'medium' | 'low';
    description: string;
    timestamp: string;
}

const Anomalies: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [severityFilter, setSeverityFilter] = useState('all');
    const [systemFilter, setSystemFilter] = useState('all');
    
    // Sample data - replace with actual data from your backend
    const [anomalies] = useState<Anomaly[]>([
        {
            id: '1',
            aircraftId: 'AC001',
            system: 'engine',
            severity: 'high',
            description: 'Unusual engine vibration detected',
            timestamp: '2025-10-25T10:30:00'
        },
        {
            id: '2',
            aircraftId: 'AC002',
            system: 'fuel',
            severity: 'medium',
            description: 'Fuel leak detected',
            timestamp: '2025-10-26T11:00:00'
        },
        {
            id: '3',
            aircraftId: 'AC003',
            system: 'hydraulic',
            severity: 'low',
            description: 'Hydraulic fluid level low',
            timestamp: '2025-10-27T12:00:00'
        },
        {
            id: '4',
            aircraftId: 'AC004',
            system: 'engine',
            severity: 'high',
            description: 'Engine overheat warning',
            timestamp: '2025-10-28T13:00:00'
        },
        {
            id: '5',
            aircraftId: 'AC005',
            system: 'electrical',
            severity: 'medium',
            description: 'Battery voltage irregularity',
            timestamp: '2025-10-29T14:00:00'
        },
    ]);

    // Filter anomalies based on search and filters
    const filteredAnomalies = anomalies.filter(anomaly => {
        const matchesSearch = searchTerm === '' ||
            anomaly.aircraftId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            anomaly.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesSeverity = severityFilter === 'all' || anomaly.severity === severityFilter;
        const matchesSystem = systemFilter === 'all' || anomaly.system === systemFilter;

        return matchesSearch && matchesSeverity && matchesSystem;
    });

    const handleExport = (type: 'csv' | 'pdf') => {
        alert(`Exporting as ${type}`);
        // Implement export logic
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-[#3e4a5b]">Anomalies</h1>
                <p className="text-[#3e4a5b] mt-1">Track and manage detected anomalies</p>
            </div>

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
            </div>

            {/* Anomalies Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                                    Aircraft
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                                    System
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                                    Severity
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                                    Timestamp
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredAnomalies.map((anomaly) => (
                                <React.Fragment key={anomaly.id}>
                                    <tr className="hover:bg-slate-50 cursor-pointer transition">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">
                                            {anomaly.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                            {anomaly.aircraftId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                            {anomaly.system}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-3 py-1 text-xs font-medium rounded-full border`}
                                                style={{
                                                    borderColor:
                                                        anomaly.severity === 'high'
                                                            ? '#ef4444'
                                                            : anomaly.severity === 'medium'
                                                            ? '#f97316'
                                                            : '#eab308',
                                                    color:
                                                        anomaly.severity === 'high'
                                                            ? '#ef4444'
                                                            : anomaly.severity === 'medium'
                                                            ? '#f97316'
                                                            : '#eab308',
                                                }}
                                            >
                                                {anomaly.severity.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                                            {anomaly.description}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                            {new Date(anomaly.timestamp).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button className="text-blue-600 hover:text-blue-800 font-medium">
                                                View Details
                                            </button>
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
