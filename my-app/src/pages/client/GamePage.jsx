import React, { useEffect, useState } from 'react';
import { addGameReward } from '../../api/gameCoinApi';
import toast from 'react-hot-toast';
import Header from '../../components/client/Header';

const GamePage = () => {
    const [lastScore, setLastScore] = useState(null);

    useEffect(() => {
        const handleGameMessage = async (event) => {
            // Check if the message is from the game
            if (event.data && event.data.type === 'GAME_OVER') {
                console.log("Game Over Event Received:", event.data);
                const score = event.data.score;
                setLastScore(score);

                try {
                    const response = await addGameReward({ score });
                    toast.success(`Game Over! You have earned ${score} VibeCoin!`, {
                        duration: 5000,
                        position: 'top-center',
                    });
                } catch (error) {
                    console.error("Failed to add reward:", error);
                    toast.error(`Game Over! Score: ${score}. Failed to add reward: ${error.message}`, {
                        duration: 5000,
                        position: 'top-center',
                    });
                }
            }
        };

        window.addEventListener('message', handleGameMessage);

        // Cleanup listener
        return () => {
            window.removeEventListener('message', handleGameMessage);
        };
    }, []);

    return (
        <>
            <Header />
            <div className="container mx-auto p-4 py-8">
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Mini Game: VibeGame</h1>
                    <p className="text-gray-600">Play and relax with this WebGL game. Earn rewards based on your score!</p>
                    {lastScore !== null && (
                        <div className="mt-4 p-4 bg-green-100 border border-green-500 rounded-lg text-green-700 inline-block">
                            <span className="font-bold">Last Game Score:</span> {lastScore}
                        </div>
                    )}
                </div>
                <div className="flex justify-center">
                    <div className="bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-200" style={{ width: '1280px', height: '720px', maxWidth: '100%' }}>
                        <iframe
                            style={{ width: "100%", height: "100%" }}
                            src="/game/index.html"
                            title="VibeGame"
                            allowFullScreen
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default GamePage;
