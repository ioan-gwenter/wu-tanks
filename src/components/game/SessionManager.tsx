"use client";
import { Suspense, useEffect, useState } from "react";
import { Common, View } from "../canvas/View";
import { MenuTank } from "../canvas/MenuTank";
import { Joystick } from "react-joystick-component";
import { usePartySocket } from "partysocket/react";
import { Vector2 } from "three";
import { pressedKeysToVector, useMousePosition, usePressedKeys } from "./input/input";
import GameScene from "./scenes/GameScene";
import { GameState } from "./helpers/gameTypes";




export function SessionManager({ gameId }: { gameId: string }) {
    const initialGameState: GameState = {
        roomState: "LOADING",
        tanks: {},
        bullets: {},
        mines: {},
        currentRound: 0,
        currentMap: [],
    };

    const [gameState, setGameState] = useState<GameState>(initialGameState);
    const [isMobile, setIsMobile] = useState(true);

    const updateGameState = (updates: Partial<GameState>) => {
        setGameState((prevState) => ({
            ...prevState,
            ...updates,
            tanks: {
                ...prevState.tanks,
                ...(updates.tanks || {}),
            },
            bullets: {
                ...prevState.bullets,
                ...(updates.bullets || {}),
            },
            mines: {
                ...prevState.mines,
                ...(updates.mines || {}),
            },
            currentMap: updates.currentMap ?? prevState.currentMap, // Replace map only if provided
        }));
    };

    // Input
    const pressedKeys = usePressedKeys();
    const mousePosition = useMousePosition();
    const [joystickDirection, setJoystickDirection] = useState<Vector2>(
        new Vector2(0, 0)
    );

    const inputDirection = pressedKeys.size
        ? pressedKeysToVector(pressedKeys)
        : joystickDirection;


    useEffect(() => {
        sessionSocket.send(JSON.stringify({ inputDirection }));
    }, [inputDirection]);


    const sessionSocket = usePartySocket({
        host: "localhost:1999",
        room: gameId,
        party: "gameserver",

        onMessage(event) {
            const dataReceived = JSON.parse(event.data);
            console.log("Received message:", dataReceived);

            const { type, data, timestamp } = dataReceived;

            switch (type) {
                case "sessionStateUpdate":
                    updateGameState({ roomState: "LOBBY" });
                    break;

                default:
                    console.warn("Unknown message type:", type);
                    break;
            }
        },
    });

    return (
        <div className="relative h-screen w-screen">
            {/* UI Elements Div */}
            <div className="absolute inset-0 z-10 pointer-events-none flex items-start justify-center">
                <div className="pointer-events-auto p-4">
                    {/* UI content */}
                    <p className="text-black text-3xl">SESSION STATE: {gameState.roomState}</p>

                    <div
                        className="fix-ios"
                        style={{ position: "absolute", bottom: "3vh", left: "3vw" }}
                    >
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
                    <GameScene gameState={gameState} />
                </Suspense>
            </View>
        </div>
    );
}
