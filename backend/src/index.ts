// index.ts

// ✅ LOAD ENVIRONMENT VARIABLES FIRST!
import dotenv from 'dotenv';
dotenv.config();

/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import cors from 'cors';
import * as admin from 'firebase-admin';
import { analyzeFlightData } from './gemini'; // Now this will work
import { AircraftType } from './types';

console.log('GEMINI KEY LOADED:', !!process.env.GEMINI_API_KEY);

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
});

export const db = admin.firestore();
async function testFirestore() {
    const testRef = db.collection('test').doc('hello');
    await testRef.set({ message: 'Firestore is working!', time: Date.now() });
    const snap = await testRef.get();
    console.log('✅ Firestore test:', snap.data());
}

export const addAircraft = async (data: AircraftType) => {
    const ref = await db.collection('aircrafts').add(data);
    return ref.id;
};

export const logFlightData = async (aircraftId: string, data: any, filename: string) => {
    const ref = await db.collection('flightLogs').add({
        aircraftId,
        date: new Date().toISOString(),
        filename: filename,
        ...data,
    });
    return ref.id;
};

export const saveAIAnalysis = async (flightId: string, result: any) => {
    const ref = await db.collection('aiAnalyses').add({
        flightId,
        ...result,
    });
    return ref.id;
};

testFirestore();

const router = express.Router();

// Replace your existing router.post in index.ts with this one

router.post('/analyze-flight', async (req, res) => {
    try {
        const { flightId, flightData } = req.body;

        // A. Basic validation: Ensure required data is present
        if (!flightId || !flightData) {
            return res.status(400).json({ error: 'Missing flightId or flightData' });
        }

        // B. The 'analyzeFlightData' function now returns a structured object
        const analysisResult = await analyzeFlightData(flightData);

        // C. Save the entire structured analysis object to Firestore
        const analysisId = await saveAIAnalysis(flightId, analysisResult);

        // D. Return the full analysis object along with its new ID
        res.status(200).json({ analysisId, ...analysisResult });
    } catch (err) {
        console.error('Error in /analyze-flight route:', err);
        res.status(500).json({ error: 'An unexpected error occurred during AI analysis.' });
    }
});
router.get('/analyses', async (req, res) => {
    try {
        const snapshot = await db.collection('aiAnalyses').get();
        const analyses = snapshot.docs.map((doc) => doc.data());
        res.status(200).json({ analyses });
    } catch (err) {
        console.error('Error in /analyses route:', err);
        res.status(500).json({ error: 'An unexpected error occurred while fetching analyses.' });
    }
});
router.get('/aircraft', async (req, res) => {
    try {
        const snapshot = await db.collection('aircrafts').get();
        const aircrafts: AircraftType[] = snapshot.docs.map((doc) => doc.data() as AircraftType);
        res.status(200).json({ aircrafts });
    } catch (err) {
        console.error('Error in /aircraft route:', err);
        res.status(500).json({ error: 'An unexpected error occurred while fetching aircraft list.' });
    }
});
router.post('/aircraft', async (req, res) => {
    try {
        const aircraftData: AircraftType = req.body;
        const aircraftId = await addAircraft(aircraftData);
        res.status(200).json({ id: aircraftId });
    } catch (err) {
        console.error('Error in /add-aircraft route:', err);
        res.status(500).json({ error: 'An unexpected error occurred while adding aircraft.' });
    }
});
router.get('/upload', async (req, res) => {
    try {
        const snapshot = await db.collection('flightLogs').get();
        const flightLogs = snapshot.docs.map((doc) => doc.data());
        res.status(200).json({ flightLogs, filenames: snapshot.docs.map((doc) => doc.data().filename) });
    } catch (err) {
        console.error('Error in /upload route:', err);
        res.status(500).json({ error: 'An unexpected error occurred while fetching flight logs.' });
    }
});
router.post('/upload', async (req, res) => {
    try {
        const { registration, flightData, filename } = req.body;
        const flightLogId = await logFlightData(registration, flightData, filename);

        const analysisResult = await analyzeFlightData(flightData);
        await saveAIAnalysis(registration, analysisResult);

        res.status(200).json({ id: flightLogId });
    } catch (err) {
        console.error('Error in /upload route:', err);
        res.status(500).json({ error: 'An unexpected error occurred while logging flight data.' });
    }
});

const app = express();
const PORT = 3000;

app.use(cors());

app.use(express.json());

app.use('/api', router);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
