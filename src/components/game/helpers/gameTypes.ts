import { Vector2 } from "three";

export type RoomState = "LOADING" | "LOBBY" | "ROUND_START" | "ROUND_END" | "GAME_OVER";

export interface Tank {
    position: Vector2;
    headRotation: number;
    bodyRotation: number;
    color: string;
    isDead: boolean;
}

export interface Bullet {
    position: Vector2;
    rotation: number;
}

export interface Mine {
    position: Vector2;
}

export interface GameState {
    roomState: RoomState;
    tanks?: { [id: string]: Tank };
    bullets?: { [id: string]: Bullet };
    mines?: { [id: string]: Mine };
    currentRound: number;
    currentMap: number[][]; //TODO
}

export interface GameSceneProps {
    gameState: GameState;
}