import PartySocket from "partysocket";
import { Vector2 } from "three";


export interface BaseMessage<T = any> {
    type: string;
    data: T;
    timestamp: number;
}

export interface InputMessageData {
    movementInput?: Vector2;
    mousePosition?: Vector2;
}

export type InputMessage = BaseMessage<InputMessageData>;

export function sendMessage<T>(socket: PartySocket, type: string, data: T): void {
    const message: BaseMessage<T> = {
        type,
        data,
        timestamp: Date.now(),
    };
    socket.send(JSON.stringify(message));
}