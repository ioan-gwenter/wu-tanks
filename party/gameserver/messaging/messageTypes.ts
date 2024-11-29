// Base message type
interface BaseMessage {
    type: string;
}

type MessageType = "sessionStateUpdate" | "gameStateUpdate";

type Message<T extends MessageType, Payload> = BaseMessage & {
    type: T;
    payload: Payload;
};

// Payloads
interface SessionStatePayload {
    scene: string;
    state: string;
}

interface GameStatePayload {
    tanks: Array<{ id: string; position: [number, number], rotation: [number, number] }>;
    bullets: Array<{ id: string; position: [number, number], rotation: [number], bounces: number }>;
    mines: Array<{ id: string; position: [number, number] }>;
}

// Messages
type SessionStateUpdateMessage = Message<"sessionStateUpdate", SessionStatePayload>;
type GameStateUpdateMessage = Message<"gameStateUpdate", GameStatePayload>;

// Utility Functions
export function createMessage<T extends MessageType, P>(type: T, payload: P): Message<T, P> {
    return { type, payload };
}
