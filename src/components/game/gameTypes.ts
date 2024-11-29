export interface SessionState {
    roomState: RoomState;
    currentScene: Scenes;
    gameState: GameState;
    currentMap: string; //TODO to be an array
    roundNumber: number;
}

export interface GameState {
    tanks: Tank[];
    bullets: Bullet[];
    mines: Mine[];

}

export interface Bullet {
    id: string;
    position: [number, number, number];
    rotation: number;
    isFast: boolean;
}

export interface Mine {
    id: string;
    position: [number, number, number];
    isBlinking: boolean;
    isExploding: boolean;
}

export interface Tank {
    id: string;
    position: [number, number, number];
    bodyRotation: number;
    headRotation: number;
    isDead: boolean;
    isFiring: boolean;
    isPlacingMine: boolean;
}

export enum RoomState {
    LOADING = 'LOADING',
    AWAIT_START = 'AWAIT_START',
    GAME_START = 'GAME_START',
    ROUND_START = 'ROUND_START',
    ROUND_END = 'ROUND_END',
    NEXT_ROUND = 'NEXT_ROUND',
    GAME_OVER = 'GAME_OVER'
}

export enum Scenes {
    LOADING = "LOADING",
    LOBBY = "LOBBY",
    GAME = "GAME",
    GAME_OVER = "GAME_OVER"
}