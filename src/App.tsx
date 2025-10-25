// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Aircraft from './pages/Aircraft';
import AircraftDetail from './pages/AircraftDetail';
import Anomalies from './pages/Anomalies';
import DataUpload from './pages/DataUpload';
import Layout from './components/Layout';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Navigate to="/dashboard" />} />
                <Route
                    path="/*"
                    element={
                        <Layout>
                            <Routes>
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/aircraft" element={<Aircraft />} />
                                <Route path="/aircraft/:id" element={<AircraftDetail />} />
                                <Route path="/anomalies" element={<Anomalies />} />
                                <Route path="/upload" element={<DataUpload />} />
                                <Route path="/" element={<Navigate to="/dashboard" />} />
                            </Routes>
                        </Layout>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
