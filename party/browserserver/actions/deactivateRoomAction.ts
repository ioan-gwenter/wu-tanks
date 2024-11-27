import BrowserServer from "../browserserver";

export async function deactivateRoomAction(server: BrowserServer, data: any): Promise<Response> {
    try {
        // Ensure gameId is provided in the request body
        if (!data || !data.gameId) {
            return new Response("Missing 'gameId' in request body", { status: 400 });
        }

        const gameId = data.gameId;

        console.log(gameId)


        if (server.removeGameId(gameId)) {
            return new Response(`Room '${gameId}' deactivated successfully`, { status: 200 });
        } else {
            return new Response(`Room '${gameId}' does not exist or is not active`, { status: 404 });
        }
    } catch (error) {
        console.error("Error handling DEACTIVATE_ROOM_REQUEST:", error);
        return new Response("Internal server error", { status: 500 });
    }
}