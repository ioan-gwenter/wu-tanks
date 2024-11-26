'use client';

import React, { useEffect, useState } from 'react';

const RotateReminder: React.FC = () => {
    const [isPortrait, setIsPortrait] = useState<boolean | null>(null);

    useEffect(() => {
        const checkOrientation = () => {
            setIsPortrait(window.innerHeight > window.innerWidth);
        };

        checkOrientation();

        // Add event listener to monitor changes
        window.addEventListener('resize', checkOrientation);

        return () => {
            window.removeEventListener('resize', checkOrientation);
        };
    }, []);

    // If `isPortrait` is null, do not render anything (prevents SSR issues)
    if (isPortrait === null) return null;

    return isPortrait ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 text-white">
            <div className="text-center">
                <h1 className="mb-4 text-2xl font-bold">Please Rotate Your Device</h1>
                <p className="text-lg">This game is best played in landscape mode.</p>
            </div>
        </div>
    ) : null;
};

export default RotateReminder;