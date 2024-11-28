import type * as Party from "partykit/server";
import { handleRequest } from "./handlers/onRequestHandler";


const EXPIRY_PERIOD_MILLISECONDS = 10 * 1000; //How long a room should be active for


export default class GameServer implements Party.Server {
    roomId: string;

    constructor(readonly room: Party.Room, roomId: string) {
        roomId = this.room.id.toString()
    }


    async onStart() {
        if (this.room.id) {
            // save id when room starts from a connection or request
            await this.room.storage.put<string>("id", this.room.id);
        }
        this.room.storage.setAlarm(Date.now() + EXPIRY_PERIOD_MILLISECONDS); //start the expiry alarm
    }

    // HANDLE SOCKET CONNECTIONS
    async onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
        conn.send(JSON.stringify(
            {
                "type": "AWAIT_START",

            }));
    }

    // SERVER MESSAGES
    async onMessage(message: string, sender: Party.Connection) {
        console.log(`connection ${sender.id} sent message: ${message}`);
        this.room.broadcast(`${sender.id}: ${message}`, [sender.id]);
        await this.room.storage.setAlarm(Date.now() + EXPIRY_PERIOD_MILLISECONDS); // Update the rooms expiry period
    }

    // HTTP REQUESTS
    async onRequest(request: Party.Request): Promise<Response> {
        return handleRequest(this, request);
    }


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
