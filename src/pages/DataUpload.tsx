/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/DataUpload.tsx
import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const DataUpload: React.FC = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [aircraftType] = useState('Boeing 737-800');
    const [aircraftId, setAircraftId] = useState('');
    const [aircraftIdentifiers, setAircraftRegistrations] = useState<Array<{ id: string; identifier: string }>>([]);
    const [loading, setLoading] = useState(true);

    const [uploadHistory, setUploadHistory] = useState<string[]>([]);
    useEffect(() => {
        const fetchUploadHistory = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/upload');
                if (!response.ok) throw new Error('Failed to fetch upload history');
                const data = await response.json();
                setUploadHistory(data.filenames);
            } catch (err) {
                console.error(err);
            }
        };

        fetchUploadHistory();
    }, []);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            setUploadedFile(files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setUploadedFile(files[0]);
        }
    };

    // Add validation function
    const isFormValid = () => {
        return aircraftType !== '' && aircraftId !== '' && uploadedFile !== null;
    };

    // Add useEffect to fetch aircraft identifiers
    useEffect(() => {
        const fetchAircraftIdentifiers = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/aircraft');
                if (!response.ok) throw new Error('Failed to fetch aircraft');
                const data = await response.json();
                setAircraftRegistrations(data.aircrafts.map((ac: any) => ({ id: ac.id, identifier: ac.registration })));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAircraftIdentifiers();
    }, []);

    // Modify handleUpload to include aircraft info
    const handleUpload = async () => {
        if (!uploadedFile || !isFormValid()) return;

        setUploading(true);

        try {
            // Only accept JSON files for this path
            const isJsonFile =
                uploadedFile.type === 'application/json' || uploadedFile.name.toLowerCase().endsWith('.json');
            if (!isJsonFile) throw new Error('Only JSON files are supported');

            // Read file contents and parse as JSON
            const text = await uploadedFile.text();
            let parsedJson: any;
            try {
                parsedJson = JSON.parse(text);
            } catch {
                throw new Error('Invalid JSON file');
            }

            // Build JSON payload including aircraft info and file contents
            const payload = {
                aircraftType,
                aircraftId,
                data: parsedJson,
            };

            // Send JSON payload
            const res = await fetch('http://localhost:3000/api/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ filename: uploadedFile.name, registration: aircraftId, flightData: payload }),
            });

            if (!res.ok) {
                throw new Error('Upload failed');
            }

            setUploadHistory((prev) => [uploadedFile.name, ...prev]);

            setUploadedFile(null);
            setAircraftId('');
        } catch {
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'processing':
                return <Loader className="w-5 h-5 text-blue-600 animate-spin" />;
            case 'failed':
                return <AlertCircle className="w-5 h-5 text-red-600" />;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Data Upload</h1>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Aircraft Selection */}
                <div className="bg-white rounded-xl p-6 border border-[#ced1e8] shadow-sm">
                    <h2 className="text-lg font-semibold text-[#3E4A5B] mb-4">Aircraft Details</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[#3E4A5B] mb-2">Aircraft Type</label>
                            <select
                                value={aircraftType}
                                className="w-full rounded-lg border border-[#ced1e8] p-2.5 text-[#3E4A5B]"
                            >
                                <option value="737-800">Boeing 737-800</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#3E4A5B] mb-2">
                                Aircraft Registration
                            </label>
                            <select
                                value={aircraftId}
                                onChange={(e) => setAircraftId(e.target.value)}
                                className="w-full rounded-lg border border-[#ced1e8] p-2.5 text-[#3E4A5B]"
                                disabled={loading || !aircraftType}
                            >
                                <option value="">Select registration</option>
                                {aircraftIdentifiers.map((aircraft) => (
                                    <option key={aircraft.id} value={aircraft.identifier}>
                                        {aircraft.identifier}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* File Upload - modify the existing upload section to be disabled when form is invalid */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl p-6 border border-[#ced1e8] shadow-sm">
                        <h2 className="text-lg font-semibold text-[#3E4A5B] mb-4">Upload Telemetry File</h2>

                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-xl p-8 text-center transition ${
                                !aircraftType || !aircraftId
                                    ? 'border-[#ced1e8] bg-slate-50 opacity-50 cursor-not-allowed'
                                    : isDragging
                                    ? 'border-[#150a82] bg-[#ced1e8]'
                                    : 'border-[#ced1e8] hover:border-[#150a82]'
                            }`}
                        >
                            <Upload
                                className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-blue-600' : 'text-slate-400'}`}
                            />
                            <p className="text-slate-700 font-medium mb-2">
                                {uploadedFile ? uploadedFile.name : 'Drag and drop your file here'}
                            </p>
                            <p className="text-sm text-slate-500 mb-4">Supports JSON only</p>
                            <label className="inline-block">
                                <input type="file" accept=".json" onChange={handleFileSelect} className="hidden" />
                                <span
                                    className={
                                        'px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer inline-block transition'
                                    }
                                >
                                    Browse Files
                                </span>
                            </label>
                        </div>

                        {uploadedFile && (
                            <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <FileText className="w-5 h-5 text-slate-600" />
                                        <div>
                                            <p className="text-sm font-medium text-slate-800">{uploadedFile.name}</p>
                                            <p className="text-xs text-slate-500">
                                                {(uploadedFile.size / 1024).toFixed(2)} KB
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleUpload}
                                        disabled={uploading}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                    >
                                        {uploading ? (
                                            <>
                                                <Loader className="w-4 h-4 animate-spin" />
                                                <span>Uploading...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-4 h-4" />
                                                <span>Upload</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Upload History */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="p-6 border-b border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-800">Upload History</h2>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {uploadHistory.map((upload) => (
                            <div key={upload} className="p-6 hover:bg-slate-50 transition">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-3">
                                        {getStatusIcon('success')}
                                        <div>
                                            <p className="font-medium text-slate-800">{upload}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataUpload;
