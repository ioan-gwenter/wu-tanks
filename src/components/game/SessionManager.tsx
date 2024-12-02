"use client";
import { Suspense, useEffect, useState } from "react";
import { Common, View } from "../canvas/View";
import { MenuTank } from "../canvas/MenuTank";
import { Joystick } from "react-joystick-component";
import { usePartySocket } from "partysocket/react";
import { Vector2 } from "three";
import { pressedKeysToVector, useMousePosition, usePressedKeys } from "./input/input";
import GameScene from "./scenes/GameScene";
import { Bullet, GameState, Mine, Tank } from "./helpers/gameTypes";
import { InputMessageData, sendMessage } from "./messaging/messages";
import { mergeDeltas } from "./helpers/gameHelper";


interface DeltaUpdate {
    tanks?: { [id: string]: Partial<Tank> };
    bullets?: { [id: string]: Partial<Bullet> };
    mines?: { [id: string]: Partial<Mine> };
}




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
                case "GAME_UPDATE":
                    console.log("delta recieved")
                    if (data && data.deltas) {
                        console.log(data.deltas);
                        applyDeltas(data.deltas);
                    }
                    break;

                default:
                    console.warn("Unknown message type:", type);
                    break;
            }
        },
    });

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


    const applyDeltas = (deltas: DeltaUpdate) => {
        setGameState((prevState) => ({
            ...prevState,
            tanks: mergeDeltas(prevState.tanks, deltas.tanks),
            bullets: mergeDeltas(prevState.bullets, deltas.bullets),
            mines: mergeDeltas(prevState.mines, deltas.mines),
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
        // Create InputMessageData based on current input state
        const inputMessageData: InputMessageData = {
            movementInput: inputDirection.length() > 0 ? inputDirection : undefined,
            mousePosition: mousePosition ? new Vector2(mousePosition.x, mousePosition.y) : undefined,
        };

        // Send the message if there are any inputs
        if (inputMessageData.movementInput || inputMessageData.mousePosition) {
            sendMessage(sessionSocket, "INPUT", inputMessageData);
        }
    }, [inputDirection, mousePosition, sessionSocket]);




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
