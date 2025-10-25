import React, { useState, useRef, useEffect } from 'react';
// import reactLogo from './assets/react.svg';
// import viteLogo from '/vite.svg';
import './App.css';

function App() {
    const [count, setCount] = useState(0);
    const clickRef = useRef<HTMLButtonElement | null>(null);
    const resetRef = useRef<HTMLButtonElement | null>(null);

    const [clickPos, setClickPos] = useState({ left: 80, top: 80 });
    const [resetPos, setResetPos] = useState({ left: 240, top: 80 });

    // Helper to compute a random, viewport-safe position for a button
    const randomPosFor = (btn: HTMLButtonElement | null) => {
        const margin = 12;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const bw = btn?.offsetWidth ?? 140;
        const bh = btn?.offsetHeight ?? 64;
        const maxLeft = Math.max(margin, vw - bw - margin);
        const maxTop = Math.max(margin, vh - bh - margin);
        return {
            left: Math.floor(Math.random() * (maxLeft - margin + 1)) + margin,
            top: Math.floor(Math.random() * (maxTop - margin + 1)) + margin,
        };
    };

    useEffect(() => {
        // initial placement once DOM is ready
        const placeInitial = () => {
            setTimeout(() => {
                setClickPos(randomPosFor(clickRef.current));
                setResetPos(randomPosFor(resetRef.current));
            }, 50);
        };

        placeInitial();

        // Move both buttons every 1.5s
        const id = setInterval(() => {
            setClickPos(randomPosFor(clickRef.current));
            setResetPos(randomPosFor(resetRef.current));
        }, 1500);

        // move on resize to keep them visible
        const onResize = () => {
            setClickPos(randomPosFor(clickRef.current));
            setResetPos(randomPosFor(resetRef.current));
        };
        window.addEventListener('resize', onResize);

        return () => {
            clearInterval(id);
            window.removeEventListener('resize', onResize);
        };
    }, []);

    return (
        <>
            <div className="app-root w-screen h-screen relative overflow-hidden">
                <button
                    ref={clickRef}
                    onClick={() => setCount(count + 1)}
                    className="floating-btn bg-blue-500 hover:bg-blue-600 text-white text-2xl font-semibold"
                    style={{ left: `${clickPos.left}px`, top: `${clickPos.top}px` }}
                    title="Click me"
                >
                    click
                </button>

                <button
                    ref={resetRef}
                    onClick={() => setCount(0)}
                    className="floating-btn bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-black dark:text-white text-2xl font-semibold"
                    style={{ left: `${resetPos.left}px`, top: `${resetPos.top}px` }}
                    title="Reset"
                >
                    reset
                </button>

                <div className="fixed top-4 right-4 z-50 bg-white/80 dark:bg-gray-800/80 text-black dark:text-white rounded-md shadow px-3 py-2">
                    Number of times pressed: {count}
                </div>
            </div>
        </>
    );
}

export default App;
