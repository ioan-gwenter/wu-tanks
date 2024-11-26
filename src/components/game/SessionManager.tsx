"use client"
import { Suspense, useState } from "react";
import { Common, View } from "../canvas/View";
import { MenuTank } from "../canvas/MenuTank";
import LobbyScene from "./scenes/LobbyScene";
import { Joystick } from "react-joystick-component";

enum SessionState {
    AWAIT_START = 'AWAIT_START',
    ROUND_START = 'ROUND_START',
    ROUND_END = 'ROUND_END',
    NEXT_ROUND = 'NEXT_ROUND',
    GAME_OVER = 'GAME_OVER'
}

enum Scenes {
    LOADING = "LOADING",
    LOBBY = "LOBBY",
    GAME = "GAME",
    GAME_OVER = "GAME_OVER"
}

// Map SceneState to Scene Objects
const SceneMap = {
    [Scenes.LOADING]: () => <p>Loading...</p>,
    [Scenes.LOBBY]: LobbyScene,
    [Scenes.GAME]: () => <MenuTank scale={8} position={[0, -0.4, -1]} />,
    [Scenes.GAME_OVER]: () => <p>Game Over</p>,
};


export function SessionManager({ gameId }: { gameId: string }) {

    // Session State Machine Management
    const [sessionState, setSessionState] = useState<SessionState>(SessionState.AWAIT_START);
    const [roundNum, setCurrentRoundNum] = useState<number>(-1);

    // Scene Display Management
    const [isLoading, setLoading] = useState<boolean | null>(null);
    const [currentScene, setCurrentScene] = useState<Scenes>(Scenes.LOBBY);
    const CurrentSceneComponent = SceneMap[currentScene];

    return (
        <div className="relative h-screen w-screen">
            {/* UI Elements Div */}
            <div className="absolute inset-0 z-10 pointer-events-none flex items-start justify-center">
                <div className="pointer-events-auto p-4">
                    {/* UI content */}
                    <p className="text-white text-3xl">SESSION STATE: {sessionState}</p>

                    <div className="fix-ios" style={{ position: "absolute", bottom: "3vh", left: "3vw" }}>
                        <Joystick
                            size={100}
                            sticky={false}
                            baseColor="white"
                            stickColor="grey"
                        />
                    </div>

                </div>
            </div>

            {/* 3D View Div */}
            <View className="absolute inset-0 z-0">
                <Suspense fallback={null}>
                    <CurrentSceneComponent />
                </Suspense>
            </View>
        </div>
    );

}