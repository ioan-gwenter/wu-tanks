import type * as Party from "partykit/server";
import { handleRequest } from "./handlers/onRequestHandler";

export default class BrowserServer implements Party.Server {
  activeGameIds: Set<string> = new Set<string>();

  constructor(readonly room: Party.Room) {
    console.log(this.room.id)
  }

  // Initialize the activeGameIds from persistent storage
  async onStart() {
    const storedIds = await this.room.storage.get<string[]>("activeGameIds");
    this.activeGameIds = new Set(storedIds ?? []);
    console.log(`Loaded active game IDs: ${Array.from(this.activeGameIds)}`);
  }

  // Persist the activeGameIds to storage
  private async saveActiveGameIds() {
    await this.room.storage.put("activeGameIds", Array.from(this.activeGameIds));
    console.log(`Saved active game IDs: ${Array.from(this.activeGameIds)}`);
  }

  // HANDLE SOCKET CONNECTIONS
  async onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    console.log("Someone joined");
  }

  // SERVER MESSAGES
  async onMessage(message: string, sender: Party.Connection) {
    console.log(`connection ${sender.id} sent message: ${message}`);
    this.room.broadcast(`${sender.id}: ${message}`, [sender.id]);
  }

  // HTTP REQUESTS
  async onRequest(request: Party.Request): Promise<Response> {
    return handleRequest(this, request);
  }

  // ADD GAME ID
  addGameId(gameId: string): boolean {
    if (this.activeGameIds.has(gameId)) {
      return false; // Game ID already exists
    }
    this.activeGameIds.add(gameId);
    this.saveActiveGameIds();
    return true;
  }

  // REMOVE GAME ID
  removeGameId(gameId: string): boolean {
    const removed = this.activeGameIds.delete(gameId);
    console.log('removed game id: ', gameId)
    if (removed) {
      this.saveActiveGameIds();
    }
    return removed;
  }

  // CHECK FOR GAME ID
  hasGameId(gameId: string): boolean {
    return this.activeGameIds.has(gameId);
  }
}

BrowserServer satisfies Party.Worker;