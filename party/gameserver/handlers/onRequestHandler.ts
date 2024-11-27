import gameServer from "../gameserver";
import type * as Party from "partykit/server";

export async function handleRequest(
    server: gameServer,
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