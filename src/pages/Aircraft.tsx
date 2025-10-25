/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/Aircraft.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Plane, AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import type { AircraftType } from '../types';

const Aircraft: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    const [aircraft, setAircraft] = useState<AircraftType[]>([]);
    useEffect(() => {
        const fetchAircraftIds = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/aircraft');
                const data = await response.json();
                return setAircraft(data.aircrafts);
            } catch (error) {
                console.error('Error fetching aircraft data:', error);
            }
        };

        fetchAircraftIds();
    }, []);

    const [newAircraft, setNewAircraft] = useState<AircraftType>({
        id: '',
        registration: '',
        type: 'Boeing 737-800',
        totalFlightHours: 0,
        flightCycles: 0,
        lastMaintenance: '',
        skyScore: 100,
        status: 'normal',
    });

    const filteredAircraft = aircraft.filter(
        (ac) =>
            ac.registration.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ac.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddAircraft = async () => {
        if (!newAircraft.type || !newAircraft.registration) {
            alert('Please fill in all required fields');
            return;
        }

        setAircraft([
            ...aircraft,
            {
                ...newAircraft,
                skyScore: 100,
                status: 'normal',
            },
        ]);

        await fetch('http://localhost:3000/api/aircraft', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newAircraft),
        });

        // Reset form
        setNewAircraft({
            id: '',
            registration: '',
            type: 'Boeing 737-800',
            totalFlightHours: 0,
            flightCycles: 0,
            lastMaintenance: '',
            skyScore: 100,
            status: 'normal',
        });
        setShowAddModal(false);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'normal':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'caution':
                return <AlertCircle className="w-5 h-5 text-orange-500" />;
            case 'critical':
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            default:
                return null;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'normal':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'caution':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'critical':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    const getHealthScoreColor = (score: number) => {
        if (score >= 85) return 'text-green-600';
        if (score >= 75) return 'text-orange-600';
        return 'text-red-600';
    };

    const stats = {
        total: aircraft.length,
        normal: aircraft.filter((ac) => ac.status === 'normal').length,
        caution: aircraft.filter((ac) => ac.status === 'caution').length,
        critical: aircraft.filter((ac) => ac.status === 'critical').length,
        avgSkyScore: Math.round(aircraft.reduce((sum, ac) => sum + ac.skyScore, 0) / aircraft.length),
    };

    return (
        <div className="space-y-6 w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Aircraft Fleet</h1>
                    <p className="text-slate-600 mt-1">Manage and monitor your aircraft fleet</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md whitespace-nowrap"
                >
                    <Plus className="w-5 h-5" />
                    Add Aircraft
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-md border border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <Plane className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-slate-600 text-sm">Total</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md border border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-3 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-slate-600 text-sm">Normal</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.normal}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md border border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="bg-orange-100 p-3 rounded-lg">
                            <AlertCircle className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-slate-600 text-sm">Caution</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.caution}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md border border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="bg-red-100 p-3 rounded-lg">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <p className="text-slate-600 text-sm">Critical</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.critical}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-3 rounded-lg shadow-md border border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="bg-purple-100 p-3 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-slate-600 text-sm">Avg. SkyScore</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.avgSkyScore}%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-lg shadow-md border border-slate-200">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by tail number, type, or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Aircraft List */}
            <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-max">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-3 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                                    Aircraft ID
                                </th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                                    Tail Number
                                </th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                                    Flight Hours
                                </th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider hidden md:table-cell">
                                    Cycles
                                </th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider hidden lg:table-cell">
                                    Last Maintenance
                                </th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                                    SkyScore
                                </th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {filteredAircraft.map((ac) => (
                                <tr
                                    key={ac.registration}
                                    onClick={() => navigate(`/aircraft/${ac.registration}`)}
                                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                                >
                                    <td className="px-3 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <Plane className="w-4 h-4 text-slate-400" />
                                            <span className="text-sm font-medium text-slate-900">
                                                {ac.registration}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        <span className="text-sm text-slate-900">{ac.type}</span>
                                    </td>
                                    <td className="px-3 py-4 whitespace-nowrap">
                                        <span className="text-sm font-mono text-slate-900">{ac.registration}</span>
                                    </td>
                                    <td className="px-3 py-4 whitespace-nowrap">
                                        <span className="text-sm text-slate-600">
                                            {ac.totalFlightHours.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-3 py-4 whitespace-nowrap hidden md:table-cell">
                                        <span className="text-sm text-slate-600">
                                            {ac.flightCycles.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-3 py-4 whitespace-nowrap hidden lg:table-cell">
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Clock className="w-4 h-4" />
                                            {ac.lastMaintenance}
                                        </div>
                                    </td>
                                    <td className="px-3 py-4 whitespace-nowrap">
                                        <span className={`text-sm font-semibold ${getHealthScoreColor(ac.skyScore)}`}>
                                            {ac.skyScore}%
                                        </span>
                                    </td>
                                    <td className="px-3 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(ac.status)}
                                            <span
                                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(
                                                    ac.status
                                                )}`}
                                            >
                                                {ac.status.charAt(0).toUpperCase() + ac.status.slice(1)}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredAircraft.length === 0 && (
                    <div className="text-center py-12">
                        <Plane className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">No aircraft found matching your search</p>
                    </div>
                )}
            </div>

            {/* Add Aircraft Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Add New Aircraft</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Aircraft Type *
                                    </label>
                                    <select
                                        value={newAircraft.type}
                                        onChange={(e) => setNewAircraft({ ...newAircraft, type: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Boeing 737-800">Boeing 737-800</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Tail Number *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., N12345"
                                        value={newAircraft.registration}
                                        onChange={(e) =>
                                            setNewAircraft({ ...newAircraft, registration: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Total Flight Hours
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={newAircraft.totalFlightHours}
                                        onChange={(e) =>
                                            setNewAircraft({
                                                ...newAircraft,
                                                totalFlightHours: parseInt(e.target.value) || 0,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Flight Cycles
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={newAircraft.flightCycles}
                                        onChange={(e) =>
                                            setNewAircraft({
                                                ...newAircraft,
                                                flightCycles: parseInt(e.target.value) || 0,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Last Maintenance Date
                                    </label>
                                    <input
                                        type="date"
                                        value={newAircraft.lastMaintenance}
                                        onChange={(e) =>
                                            setNewAircraft({ ...newAircraft, lastMaintenance: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex gap-3">
                                <button
                                    onClick={handleAddAircraft}
                                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Add Aircraft
                                </button>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Aircraft;
