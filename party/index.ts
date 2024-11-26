import type * as Party from "partykit/server";
import { handleRequest } from "./handlers/onRequestHandler";

export default class GameServer implements Party.Server {

  constructor(readonly room: Party.Room) { }

  // HANDLE SOCKET CONNECTIONS
  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    console.log(
      `Connected:
  id: ${conn.id}
  room: ${this.room.id}
  url: ${new URL(ctx.request.url).pathname}`
    );

    conn.send("hello from server");
  }

  // SERVER MESSAGES
  onMessage(message: string, sender: Party.Connection) {
    console.log(`connection ${sender.id} sent message: ${message}`);
    this.room.broadcast(`${sender.id}: ${message}`, [sender.id]);
  }

  // HTTP REQUESTS
  async onRequest(request: Party.Request): Promise<Response> {
    return handleRequest(this, request);
  }

}

GameServer satisfies Party.Worker;