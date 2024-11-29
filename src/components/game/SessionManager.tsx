"use client"
import { Suspense, useEffect, useState } from "react";
import { Common, View } from "../canvas/View";
import { MenuTank } from "../canvas/MenuTank";
import LobbyScene from "./scenes/LobbyScene";
import { Joystick } from "react-joystick-component";
import GameScene from "./scenes/GameScene";
import { usePartySocket } from "partysocket/react";
import { Vector2 } from "three";
import { pressedKeysToVector, useMousePosition, usePressedKeys } from "./input/input";
import JoystickComponent from "./input/joystickComp";
import { isMobileDevice } from "@/helpers/isMobileDevice";

enum SessionState {
    LOADING = 'LOADING',
    AWAIT_START = 'AWAIT_START',
    GAME_START = 'GAME_START',
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
    [Scenes.LOADING]: MenuTank, //Placeholder for loading menu
    [Scenes.LOBBY]: LobbyScene,
    [Scenes.GAME]: GameScene,
    [Scenes.GAME_OVER]: MenuTank,
};


export function SessionManager({ gameId }: { gameId: string }) {

    // Connect to the game server

    // Session State Machine Management
    const [sessionState, setSessionState] = useState<SessionState>(SessionState.LOADING);

    // Scene Display Management
    const [currentScene, setCurrentScene] = useState<Scenes>(Scenes.LOADING);
    const CurrentSceneComponent = SceneMap[currentScene];

    const [isMobile, setIsMobile] = useState(false);

    //Input

    // Mouse and Keyb
    const pressedKeys = usePressedKeys();
    const mousePosition = useMousePosition();

    // Joystick

    const [joystickDirection, setJoystickDirection] = useState<Vector2>(
        new Vector2(0, 0)
    );

    //Input Direciton
    const inputDirection = pressedKeys.size
        ? pressedKeysToVector(pressedKeys)
        : joystickDirection;

    useEffect(() => {
        setIsMobile(isMobileDevice());
    }, []);


    const sessionSocket = usePartySocket({
        host: "localhost:1999",
        room: gameId,
        party: "gameserver",

        onMessage(event) {
            const dataReceived = JSON.parse(event.data);
            console.log("Received message:", dataReceived);

            const { type, ...payload } = dataReceived;

            switch (type) {
                case "AWAIT_START":
                    setSessionState(SessionState.AWAIT_START)
                    setCurrentScene(Scenes.LOBBY);
                    break;

                case "GAME_START":
                    setSessionState(SessionState.GAME_START)
                    setCurrentScene(Scenes.GAME);
                    break;

                default:
                    console.warn("Unknown message type:", type);
                    break;

            }
        }

    });

    return (
        <div className="relative h-screen w-screen">
            {/* UI Elements Div */}
            <div className="absolute inset-0 z-10 pointer-events-none flex items-start justify-center">
                <div className="pointer-events-auto p-4">
                    {/* UI content */}
                    <p className="text-black text-3xl">SESSION STATE: {sessionState}</p>

                    <div className="fix-ios" style={{ position: "absolute", bottom: "3vh", left: "3vw" }}>
                        {isMobile && (
                            <Joystick
                                size={100}
                                sticky={false}
                                baseColor="white"
                                stickColor="grey"
                                start={() => setJoystickDirection(new Vector2(0, 0))}
                                move={(e) => setJoystickDirection(new Vector2(e.x!, -e.y!))}
                                stop={() => setJoystickDirection(new Vector2(0, 0))}
                            />
                        )}
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