// Base message type
interface BaseMessage {
    type: string;
}

type MessageType = "sessionStateUpdate" | "lobbyStateUpdate" | "gameStateUpdate";

type Message<T extends MessageType, Payload> = BaseMessage & {
    type: T;
    payload: Payload;
};

// Payloads
interface SessionStatePayload {
    scene: string;
    timestamp: number;
}

interface LobbyStatePayload {
    players: string[];
    host: string;
}

interface GameStatePayload {
    tanks: Array<{ id: string; position: [number, number], rotation: [number, number] }>;
    bullets: Array<{ id: string; position: [number, number] }>;
    mines: Array<{ id: string; position: [number, number] }>;
    scores: Record<string, number>;
}

// Messages
type SessionStateUpdateMessage = Message<"sessionStateUpdate", SessionStatePayload>;
type LobbyStateUpdateMessage = Message<"lobbyStateUpdate", LobbyStatePayload>;
type GameStateUpdateMessage = Message<"gameStateUpdate", GameStatePayload>;

// type AppMessage =
//     | SessionStateUpdateMessage
//     | LobbyStateUpdateMessage
//     | GameStateUpdateMessage;

// Utility Functions
function createMessage<T extends MessageType, P>(type: T, payload: P): Message<T, P> {
    return { type, payload };
}

// function isSessionStateUpdateMessage(message: AppMessage): message is SessionStateUpdateMessage {
//     return message.type === "sessionStateUpdate";
// }

// function isLobbyStateUpdateMessage(message: AppMessage): message is LobbyStateUpdateMessage {
//     return message.type === "lobbyStateUpdate";
// }

// function isGameStateUpdateMessage(message: AppMessage): message is GameStateUpdateMessage {
//     return message.type === "gameStateUpdate";
// }
