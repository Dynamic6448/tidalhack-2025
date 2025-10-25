// pages/Settings.tsx
import React, { useState } from 'react';
import { User, Bell, Sliders, Moon, Sun } from 'lucide-react';

const Settings: React.FC = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [slackNotifications, setSlackNotifications] = useState(false);
    const [anomalyThreshold, setAnomalyThreshold] = useState(75);
    const [aiSensitivity, setAiSensitivity] = useState(70);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
                <p className="text-slate-600 mt-1">Configure your preferences and alerts</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Profile */}
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-800">User Profile</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                defaultValue="John Doe"
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                            <input
                                type="email"
                                defaultValue="john.doe@aerologiq.com"
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
                            <select className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option>Admin</option>
                                <option>Analyst</option>
                                <option>Viewer</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="bg-purple-100 p-2 rounded-lg">
                            <Bell className="w-5 h-5 text-purple-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-800">Notification Settings</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                            <div>
                                <p className="font-medium text-slate-800">Email Notifications</p>
                                <p className="text-sm text-slate-600">Receive alerts via email</p>
                            </div>
                            <button
                                onClick={() => setEmailNotifications(!emailNotifications)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                                    emailNotifications ? 'bg-blue-600' : 'bg-slate-300'
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                        emailNotifications ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                            <div>
                                <p className="font-medium text-slate-800">Slack Notifications</p>
                                <p className="text-sm text-slate-600">Send alerts to Slack</p>
                            </div>
                            <button
                                onClick={() => setSlackNotifications(!slackNotifications)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                                    slackNotifications ? 'bg-blue-600' : 'bg-slate-300'
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                        slackNotifications ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-lg">
                            <label className="block text-sm font-medium text-slate-700 mb-3">
                                Anomaly Alert Threshold: {anomalyThreshold}
                            </label>
                            <input
                                type="range"
                                min="50"
                                max="100"
                                value={anomalyThreshold}
                                onChange={(e) => setAnomalyThreshold(Number(e.target.value))}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-slate-600 mt-1">
                                <span>Less Sensitive</span>
                                <span>More Sensitive</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Model Settings */}
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="bg-green-100 p-2 rounded-lg">
                            <Sliders className="w-5 h-5 text-green-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-800">AI Model Configuration</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Detection Algorithm</label>
                            <select className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option>Isolation Forest</option>
                                <option>LSTM Autoencoder</option>
                                <option>Statistical Z-Score</option>
                            </select>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-lg">
                            <label className="block text-sm font-medium text-slate-700 mb-3">
                                Model Sensitivity: {aiSensitivity}%
                            </label>
                            <input
                                type="range"
                                min="30"
                                max="100"
                                value={aiSensitivity}
                                onChange={(e) => setAiSensitivity(Number(e.target.value))}
                                className="w-full"
                            />
                            <p className="text-xs text-slate-600 mt-2">
                                Higher sensitivity may result in more false positives
                            </p>
                        </div>

                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">
                                <strong>Note:</strong> Changes to AI model settings will take effect on the next data
                                ingestion cycle.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Appearance */}
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="bg-orange-100 p-2 rounded-lg">
                            {darkMode ? (
                                <Moon className="w-5 h-5 text-orange-600" />
                            ) : (
                                <Sun className="w-5 h-5 text-orange-600" />
                            )}
                        </div>
                        <h2 className="text-lg font-semibold text-slate-800">Appearance</h2>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                            <p className="font-medium text-slate-800">Dark Mode</p>
                            <p className="text-sm text-slate-600">Toggle dark theme</p>
                        </div>
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                                darkMode ? 'bg-blue-600' : 'bg-slate-300'
                            }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                    darkMode ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium">
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default Settings;
