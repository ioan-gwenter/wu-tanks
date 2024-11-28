export const dynamic = "force-dynamic";

import { InvalidGame } from "@/components/game/scenes/InvalidGame";
import { SessionManager } from "@/components/game/SessionManager";

export default async function GamePage({
    params: { gameId },
}: {
    params: { gameId: string },
}) {

    // Check if the gameId is valid
    // console.log(gameId)
    if (!gameId || typeof gameId !== "string") {
        console.log("Invalid or missing gameId");
        return <InvalidGame />;
    }

    const sanitizedGameId = gameId.trim();

    const isValidId = /^[a-zA-Z0-9]{8}$/.test(sanitizedGameId);

    if (!isValidId) {
        console.log("Invalid ID format:", sanitizedGameId);
        return <InvalidGame />;
    }

    // Attempt to join the game
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/join`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ gameId }),
            cache: "no-store",
        });

        if (!res.ok) {
            throw new Error("Failed to connect to the server.");
        }

        const data = await res.json();

        if (!data.roomExists) {
            throw new Error("Game not found or cannot join.");
        }

        // If successful, return the SessionManager for this game
        return <SessionManager gameId={gameId} />;

    } catch (error) {
        // Show invalid game page if the game doesn't exist or an error occurs
        console.log(error)
        return <InvalidGame />;
    }
}