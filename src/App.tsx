// App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Aircraft from './pages/Aircraft';
import AircraftDetail from './pages/AircraftDetail';
import Anomalies from './pages/Anomalies';
import DataUpload from './pages/DataUpload';
import Layout from './components/Layout';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <Router>
            <Routes>
                <Route
                    path="/login"
                    element={
                        isAuthenticated ? (
                            <Navigate to="/dashboard" />
                        ) : (
                            <Login onLogin={() => setIsAuthenticated(true)} />
                        )
                    }
                />
                <Route
                    path="/*"
                    element={
                        isAuthenticated ? (
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
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
