import { generateRandomGameId } from "../util/util";
import BrowserServer from "party/browserserver/browserserver";

export async function createRoomAction(server: BrowserServer): Promise<Response> {
    const maxRetries = 3;
    let attempts = 0;
    let newGameId: string | null = null;

    while (attempts < maxRetries) {
        attempts++;
        newGameId = generateRandomGameId();

        if (!server.hasGameId(newGameId)) {
            // Add the new gameId to the active game IDs
            server.addGameId(newGameId);

            // Return the new room ID to the client
            return new Response(
                JSON.stringify({ roomId: newGameId }),
                {
                    status: 201,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }
    }

    // If all attempts fail, return an error
    return new Response(
        "Failed to generate a unique game ID. Please try again later.",
        { status: 500 }
    );
}