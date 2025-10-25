# AeroLogIQ Backend - NASA C-MAPSS Data Processing & Anomaly Detection
# Install requirements: pip install fastapi uvicorn pandas scikit-learn numpy

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import json
from typing import List, Dict, Any
from datetime import datetime, timedelta

app = FastAPI(title="AeroLogIQ API")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables to store data and models
data_cache = {}
anomaly_model = None
scaler = None
processed_data = None

# Column names for C-MAPSS dataset
COLUMN_NAMES = ['unit', 'cycle', 'setting1', 'setting2', 'setting3'] + \
               [f'sensor{i}' for i in range(1, 22)]

# Key sensors to monitor (most relevant for anomaly detection)
KEY_SENSORS = ['sensor2', 'sensor3', 'sensor4', 'sensor7', 'sensor11', 
               'sensor12', 'sensor15', 'sensor17', 'sensor20', 'sensor21']

def load_and_preprocess_data(filepath: str = 'dataset/CMaps/train_FD001.txt'):
    """Load NASA C-MAPSS dataset and preprocess for anomaly detection"""
    global processed_data, scaler
    
    try:
        # Load data
        df = pd.read_csv(filepath, sep=r'\s+', header=None, names=COLUMN_NAMES)
        
        # Select a single engine unit for demo (unit 1)
        df = df[df['unit'] == 1].copy()
        
        # Drop constant or near-constant sensors
        variance = df[KEY_SENSORS].var()
        valid_sensors = variance[variance > 0.01].index.tolist()
        
        # Normalize sensor data
        scaler = StandardScaler()
        df[valid_sensors] = scaler.fit_transform(df[valid_sensors])
        
        # Add timestamp simulation (1 cycle = 1 hour)
        start_time = datetime.now() - timedelta(hours=len(df))
        df['timestamp'] = [start_time + timedelta(hours=i) for i in range(len(df))]
        
        processed_data = df
        return df, valid_sensors
        
    except Exception as e:
        print(f"Error loading data: {e}")
        return None, []

def train_anomaly_detector(df: pd.DataFrame, sensors: List[str]):
    """Train Isolation Forest for anomaly detection"""
    global anomaly_model
    
    # Use last 20% of data as "degraded" state to learn anomalies
    train_normal = df[sensors].iloc[:int(len(df) * 0.7)]
    
    # Train Isolation Forest
    anomaly_model = IsolationForest(
        contamination=0.1,  # Expect ~10% anomalies
        random_state=42,
        n_estimators=100
    )
    anomaly_model.fit(train_normal)
    
    # Predict anomalies on full dataset
    df['anomaly_score'] = anomaly_model.score_samples(df[sensors])
    df['is_anomaly'] = anomaly_model.predict(df[sensors]) == -1
    
    return df

@app.on_event("startup")
async def startup_event():
    """Initialize data and model on startup"""
    print("🚀 Loading NASA C-MAPSS data...")
    df, sensors = load_and_preprocess_data()
    
    if df is not None:
        print(f"✅ Loaded {len(df)} data points")
        print(f"📊 Training anomaly detector on {len(sensors)} sensors...")
        train_anomaly_detector(df, sensors)
        print("✅ Model trained successfully!")
    else:
        print("⚠️  Warning: Could not load data. Place train_FD001.txt in root directory.")

@app.get("/")
def root():
    """API health check"""
    return {
        "status": "online",
        "message": "AeroLogIQ Backend API",
        "endpoints": ["/api/telemetry", "/api/anomalies", "/api/health-score", "/api/insights"]
    }

@app.get("/api/telemetry")
def get_telemetry(limit: int = 100):
    """Get recent telemetry data"""
    if processed_data is None:
        raise HTTPException(status_code=503, detail="Data not loaded")
    
    # Get last N data points
    recent_data = processed_data.tail(limit)
    
    # Convert to JSON-friendly format
    telemetry = []
    for _, row in recent_data.iterrows():
        point = {
            "timestamp": row['timestamp'].isoformat(),
            "cycle": int(row['cycle']),
            "sensors": {
                "temperature_1": float(row['sensor2']),
                "temperature_2": float(row['sensor3']),
                "temperature_3": float(row['sensor4']),
                "pressure_1": float(row['sensor7']),
                "pressure_2": float(row['sensor11']),
                "pressure_3": float(row['sensor12']),
                "vibration": float(row['sensor15']),
                "oil_temp": float(row['sensor17']),
                "fan_speed": float(row['sensor20']),
                "core_speed": float(row['sensor21'])
            },
            "is_anomaly": bool(row['is_anomaly']),
            "anomaly_score": float(row['anomaly_score'])
        }
        telemetry.append(point)
    
    return {"data": telemetry, "count": len(telemetry)}

@app.get("/api/anomalies")
def get_anomalies():
    """Get all detected anomalies with details"""
    if processed_data is None:
        raise HTTPException(status_code=503, detail="Data not loaded")
    
    anomalies = processed_data[processed_data['is_anomaly'] == True]
    
    results = []
    for _, row in anomalies.iterrows():
        # Identify which sensors are most anomalous
        sensor_values = {k: float(row[k]) for k in KEY_SENSORS if k in row}
        max_sensor = max(sensor_values, key=lambda k: abs(sensor_values[k]))
        
        anomaly_info = {
            "timestamp": row['timestamp'].isoformat(),
            "cycle": int(row['cycle']),
            "severity": "high" if row['anomaly_score'] < -0.5 else "medium",
            "anomaly_score": float(row['anomaly_score']),
            "primary_sensor": max_sensor,
            "sensor_value": sensor_values[max_sensor]
        }
        results.append(anomaly_info)
    
    return {"anomalies": results, "total": len(results)}

@app.get("/api/health-score")
def get_health_score():
    """Calculate overall engine health score (0-100)"""
    if processed_data is None:
        raise HTTPException(status_code=503, detail="Data not loaded")
    
    # Use recent data (last 50 cycles)
    recent = processed_data.tail(50)
    
    # Health score based on anomaly rate and severity
    anomaly_rate = recent['is_anomaly'].sum() / len(recent)
    avg_score = recent['anomaly_score'].mean()
    
    # Convert to 0-100 scale (higher is better)
    health_score = max(0, min(100, (1 - anomaly_rate) * 100 + avg_score * 10))
    
    # Determine health status
    if health_score > 85:
        status = "excellent"
        color = "green"
    elif health_score > 70:
        status = "good"
        color = "blue"
    elif health_score > 50:
        status = "fair"
        color = "yellow"
    else:
        status = "critical"
        color = "red"
    
    return {
        "health_score": round(health_score, 1),
        "status": status,
        "color": color,
        "anomaly_rate": round(anomaly_rate * 100, 1),
        "total_cycles": int(processed_data['cycle'].max())
    }

@app.get("/api/insights")
def get_maintenance_insights():
    """Generate maintenance insights based on recent anomalies"""
    if processed_data is None:
        raise HTTPException(status_code=503, detail="Data not loaded")
    
    recent_anomalies = processed_data[processed_data['is_anomaly'] == True].tail(10)
    
    insights = []
    
    if len(recent_anomalies) > 0:
        # Analyze patterns
        for sensor in KEY_SENSORS:
            if sensor in recent_anomalies.columns:
                avg_val = recent_anomalies[sensor].mean()
                if abs(avg_val) > 1.5:  # Significant deviation
                    insight = generate_insight(sensor, avg_val)
                    if insight:
                        insights.append(insight)
    
    if len(insights) == 0:
        insights.append({
            "type": "info",
            "message": "All systems operating within normal parameters",
            "recommendation": "Continue routine monitoring",
            "priority": "low"
        })
    
    return {"insights": insights, "timestamp": datetime.now().isoformat()}

def generate_insight(sensor: str, deviation: float) -> Dict[str, Any]:
    """Generate human-readable maintenance insight for a sensor"""
    
    sensor_map = {
        'sensor2': ('Engine Temperature', 'temperature sensor or cooling system'),
        'sensor3': ('LPC Outlet Temperature', 'low pressure compressor'),
        'sensor4': ('HPC Outlet Temperature', 'high pressure compressor'),
        'sensor7': ('Total Pressure', 'pressure regulation system'),
        'sensor11': ('Static Pressure', 'static pressure sensor'),
        'sensor12': ('Pressure Ratio', 'compression efficiency'),
        'sensor15': ('Bypass Ratio', 'bypass duct or fan'),
        'sensor17': ('Bleed Enthalpy', 'bleed air system'),
        'sensor20': ('Physical Fan Speed', 'fan bearings or balance'),
        'sensor21': ('Physical Core Speed', 'core engine bearings')
    }
    
    if sensor not in sensor_map:
        return None
    
    name, component = sensor_map[sensor]
    severity = "high" if abs(deviation) > 2.0 else "medium"
    
    return {
        "type": "warning" if severity == "high" else "caution",
        "message": f"{name} showing {abs(deviation):.1f}σ deviation from baseline",
        "recommendation": f"Inspect {component} during next maintenance window",
        "priority": severity,
        "affected_component": component
    }

@app.get("/api/stream/{cycle}")
def stream_single_cycle(cycle: int):
    """Get data for a specific cycle (for live streaming simulation)"""
    if processed_data is None:
        raise HTTPException(status_code=503, detail="Data not loaded")
    
    cycle_data = processed_data[processed_data['cycle'] == cycle]
    
    if len(cycle_data) == 0:
        raise HTTPException(status_code=404, detail="Cycle not found")
    
    row = cycle_data.iloc[0]
    return {
        "timestamp": row['timestamp'].isoformat(),
        "cycle": int(cycle),
        "sensors": {k: float(row[k]) for k in KEY_SENSORS if k in row},
        "is_anomaly": bool(row['is_anomaly']),
        "anomaly_score": float(row['anomaly_score'])
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)