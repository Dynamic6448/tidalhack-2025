// index.ts

// ✅ LOAD ENVIRONMENT VARIABLES FIRST!
import dotenv from 'dotenv';
dotenv.config();

/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import cors from 'cors';
import * as admin from 'firebase-admin';
import { analyzeFlightData } from './gemini'; // Now this will work

console.log('GEMINI KEY LOADED:', !!process.env.GEMINI_API_KEY);

// ... the rest of your index.ts file remains the same
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

export const addAircraft = async (data: any) => {
    const ref = await db.collection('aircrafts').add(data);
    return ref.id;
};

export const logFlightData = async (aircraftId: string, data: any) => {
    const ref = await db.collection('flightLogs').add({
        aircraftId,
        date: new Date().toISOString(),
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
        let analysisResult;
        try {
            analysisResult = await analyzeFlightData(flightData);
        } catch (e) {
            console.error('Error during AI analysis:', e);
        }

        // C. Save the entire structured analysis object to Firestore
        let analysisId;
        try {
            analysisId = await saveAIAnalysis(flightId, analysisResult);
        } catch (e) {
            console.error('Error saving AI analysis to Firestore:', e);
        }

        // D. Return the full analysis object along with its new ID
        res.status(200).json({ analysisId, ...analysisResult });
    } catch (err) {
        console.error('Error in /analyze-flight route:', err);
        res.status(500).json({ error: 'An unexpected error occurred during AI analysis.' });
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
