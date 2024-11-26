"use client"
import { Suspense, useState } from "react";
import { Common, View } from "../canvas/View";
import { MenuTank } from "../canvas/MenuTank";
import { Session } from "inspector/promises";

enum SessionState {
    AWAIT_START = 'AWAIT_START',
    ROUND_START = 'ROUND_START',
    ROUND_END = 'ROUND_END',
    NEXT_ROUND = 'NEXT_ROUND',
    GAME_OVER = 'GAME_OVER'
}

enum Scenes {
    LOADING = "TODO",
    LOBBY = "TODO",
    GAME = "TODO",
    GAME_OVER = "TODO"
}


export function SessionManager({ gameId }: { gameId: string }) {

    // Session State Machine Management
    const [sessionState, setSessionState] = useState<SessionState>(SessionState.AWAIT_START);
    const [roundNum, setCurrentRoundNum] = useState<number>(-1);

    // Scene Display Management
    const [isLoading, setLoading] = useState<boolean | null>(null);

    return (
        <div className="relative h-screen w-screen">
            {/* UI Elements Div */}
            <div className="absolute inset-0 z-10 pointer-events-none flex items-start justify-center">
                <div className="pointer-events-auto p-4">
                    {/* UI content */}
                    <p className="text-white text-3xl">SESSION STATE: {sessionState}</p>
                </div>
            </div>

            {/* 3D View Div */}
            <View className="absolute inset-0 z-0">
                <Suspense fallback={null}>
                    <MenuTank scale={8} position={[0, -0.4, -1]} />
                    <Common color={'black'} />
                </Suspense>
            </View>
        </div>
    );

}