import BrowserServer from "../browserserver";

export async function joinRoomAction(server: BrowserServer, data: any): Promise<Response> {
    try {


        // Ensure gameId is provided in the request body
        if (!data || !data.gameId) {
            return new Response("Missing 'gameId' in request body", { status: 400 });
        }

        const gameId = data.gameId;

        console.log(`BrowserServer: Request to join ${gameId}`)

        if (server.hasGameId(gameId)) {
            console.log(`BrowserServer: Game ID ${gameId} is active!`)
            return new Response(`Join Request to: '${gameId}' approved!`, { status: 200 });

        } else {
            console.log(`BrowserServer: Game ID ${gameId} doesnt exist!`)
            return new Response(`Room '${gameId}' does not exist or is not active`, { status: 404 });
        }
    } catch (error) {
        console.error("BrowserServer: Error handling JOIN_ROOM_REQUEST:", error);
        return new Response("Internal server error", { status: 500 });
    }
}