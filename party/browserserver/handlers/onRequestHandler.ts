import type * as Party from "partykit/server";
import BrowserServer from "party/browserserver/browserserver";
import { createRoomAction } from "../actions/createRoomAction";
import { deactivateRoomAction } from "../actions/deactivateRoomAction";
import { joinRoomAction } from "../actions/joinRoomRequest";


export async function handleRequest(
    server: BrowserServer, //Game Server Instance
    request: Party.Request

): Promise<Response> {

    // POST REQUESTS

    // console.log(`A request was recieved on ${server.room.internalID}!`); // DEBUG

    if (request.method === "POST") {
        try {
            const body: { action: string; data?: {} } = await request.json();

            if (!body.action) {
                return new Response("Missing 'action' field in request body", { status: 400 });
            }

            switch (body.action) {
                case "CREATE_ROOM_REQUEST":
                    return createRoomAction(server);
                case "DEACTIVATE_ROOM_REQUEST":
                    return deactivateRoomAction(server, body.data);
                case "JOIN_ROOM_REQUEST":
                    return joinRoomAction(server, body.data)
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