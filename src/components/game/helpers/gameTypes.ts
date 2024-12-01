export type RoomState = "LOADING" | "LOBBY" | "ROUND_START" | "ROUND_END" | "GAME_OVER";

export interface Tank {
    position: [number, number];
    headRotation: number;
    bodyRotation: number;
    color: string;
    isDead: boolean;
}

export interface Bullet {
    position: [number, number];
    rotation: number;
}

export interface Mine {
    position: [number, number];
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