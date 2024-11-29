interface GameStatePayload {
    players: Array<{
        id: string;
        name: string;
        position: [number, number];
        rotation: [number, number];
        score: number;
    }>;
    bullets: Array<{ id: string; position: [number, number], rotation: [number, number] }>;
    mines: Array<{ id: string; position: [number, number] }>;
}

type Message =
    | { type: "GAME_START"; payload: GameStatePayload }
    | { type: "GAME_UPDATE"; payload: GameStatePayload };

export const messageHandlers = {
    GAME_START: (
        payload: GameStatePayload,
        setGameState: (state: GameStatePayload) => void
    ) => {
        setGameState(payload); // Initialize game state
    },

    GAME_UPDATE: (
        payload: GameStatePayload,
        setGameState: (state: GameStatePayload) => void
    ) => {
        setGameState(payload); // Update game state
    },
};