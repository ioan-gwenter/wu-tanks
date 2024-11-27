import type * as Party from "partykit/server";
import { handleRequest } from "./handlers/onRequestHandler";


// const EXPIRY_PERIOD_MILLISECONDS = 10 * 1000; //How long a room should be active for


export default class GameServer implements Party.Server {
    roomId: string;

    constructor(readonly room: Party.Room, roomId: string) {
        roomId = this.room.id.toString()
    }


    async onStart() {
        // this.room.storage.setAlarm(Date.now() + EXPIRY_PERIOD_MILLISECONDS); //start the expiry alarm
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
        // await this.room.storage.setAlarm(Date.now() + EXPIRY_PERIOD_MILLISECONDS); // Update the rooms expiry period
    }

    // HTTP REQUESTS
    async onRequest(request: Party.Request): Promise<Response> {
        return handleRequest(this, request);
    }

    // onAlarm() {
    //     this.deactivateReq()

    // }

    // deactivateReq = () => {
    //     const browserParty = this.room.context.parties.browserserver;
    //     const browserRoom = browserParty.get("browserserver");
    //     const res = browserRoom.fetch(`http://0.0.0.0:1999/party/browserserver`, {
    //         method: "POST",
    //         body: JSON.stringify({ action: "DEACTIVATE_ROOM_REQUEST", data: { gameId: this.roomId } }),
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //     });
    // }

}
