import type * as Party from "partykit/server";
import { handleRequest } from "./handlers/onRequestHandler";
import { createMessage } from "./messaging/messageTypes";
import GameStateManager from "./gameManager";


const EXPIRY_PERIOD_MILLISECONDS: number = 1 * 60 * 1000; //How long a room should be active for

const TPS: number = 0.5;

export default class GameServer implements Party.Server {
    private roomId: string;
    private interval: ReturnType<typeof setInterval> | undefined;

    private gameStateManager: GameStateManager;


    constructor(readonly room: Party.Room, roomId: string) {
        roomId = this.room.id.toString()
        this.gameStateManager = new GameStateManager();
    }

    async onStart() {
        if (this.room.id) {
            await this.room.storage.put<string>("id", this.room.id);
        }
        this.room.storage.setAlarm(Date.now() + EXPIRY_PERIOD_MILLISECONDS);

        // Server Game Loop
        this.interval = setInterval(() => {

            const now = Date.now();

            this.gameStateManager.processInputs();

            this.gameStateManager.update(now);

            const deltas = this.gameStateManager.generateDeltas();
            if (deltas) {
                this.room.broadcast(JSON.stringify({
                    type: "GAME_UPDATE",
                    data: {
                        sequence: this.gameStateManager.getSequence(),
                        deltas,
                    },
                    timestamp: now,
                }));
            }

        }, Math.floor(1000 / TPS));
    }


    // HANDLE SOCKET CONNECTIONS
    async onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
        conn.send(JSON.stringify(createMessage("sessionStateUpdate", {
            state: "LOBBY",
        })));
        this.gameStateManager.addTank(conn.id)
    }

    // SERVER MESSAGES
    async onMessage(message: string, sender: Party.Connection) {
        const parsedMessage = JSON.parse(message);

        const { type, data, timestamp } = parsedMessage;
        const latency = Date.now() - timestamp;

        switch (type) {
            case ("INPUT"):
                this.gameStateManager.addInput(sender.id, data, timestamp, latency);
                return;
            default:
                return;

        }
    }

    // console.log(`Received ${type} from ${sender.id} with latency: ${latency}ms`);

    // HTTP REQUESTS
    async onRequest(request: Party.Request): Promise<Response> {
        return handleRequest(this, request);
    }


    // Alarm used for deactivating room when inactivity
    async onAlarm(): Promise<void> {
        const id = await this.room.storage.get<string>("id");

        try {
            console.log(`${id}: Expiry Alarm rang!`)

            const req = fetch(`http://192.168.0.4:1999/party/browserserver`, {
                method: "POST",
                body: JSON.stringify({
                    action: "DEACTIVATE_ROOM_REQUEST",
                    data: { gameId: id },
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            }).then(response => {
                if (!response.ok) {
                    throw new Error(`${id}: HTTP error! status: ${response}`);
                }
            }).catch(err => {
                console.error(`${id}: Error occurred during fetch:`, err);
            });

            this.room.storage.deleteAll();
            console.log(`${id}: Successfully Deactivated Room!`)

        } catch (err) {
            console.error(`${id}: Error occurred in onAlarm method:`, err);
        }
    }
}
