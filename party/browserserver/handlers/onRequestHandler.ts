import type * as Party from "partykit/server";
import BrowserServer from "party/browserserver/browserserver";
import { createRoomAction } from "../actions/createRoomAction";


export async function handleRequest(
    server: BrowserServer, //Game Server Instance
    request: Party.Request

): Promise<Response> {

    // POST REQUESTS
    if (request.method === "POST") {
        try {
            const body: { action: string; data?: {} } = await request.json();

            if (!body.action) {
                return new Response("Missing 'action' field in request body", { status: 400 });
            }

            switch (body.action) {
                case "CREATE_ROOM_REQUEST":
                    return createRoomAction(server);
                default:
                    return new Response(`Unknown action: ${body.action}`, { status: 400 });
            }
        } catch (error) {
            console.error("Error handling POST request:", error);
            return new Response("Invalid JSON body or error processing request", { status: 400 });
        }
    }

    // GET REQUESTS
    if (request.method === "GET") {
        return new Response("GET REQ RECEIVED ON SERVER");
    }

    return new Response("Method not allowed", { status: 405 });
}