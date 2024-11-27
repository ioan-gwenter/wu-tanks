import { PARTYKIT_URL } from "@/env";
import { NextResponse } from "next/server";

const generateRandomGameId = (): string => {
    return Math.random().toString(36).substring(2, 10);
};


export async function POST(req: Request, { params }: { params: { action: string } }) {
    const { action } = params;
    const body = await req.json();

    if (action === "join") {
        const { gameId } = body;

        if (!gameId || gameId.trim() === "") {
            return NextResponse.json({ error: "Invalid Game ID" }, { status: 400 });
        }

        return NextResponse.json({ redirect: `/${gameId}` });
    }

    // Request to create a new room
    if (action === "create") {
        try {
            const res = await fetch(`http://0.0.0.0:1999/party/browserserver`, {
                method: "POST",
                body: JSON.stringify({ action: "CREATE_ROOM_REQUEST" }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (res.ok) {

                const data = await res.json();

                // Check for a valid roomId in the response
                if (data.roomId) {
                    console.log(`Redirecting to room: ${data.roomId}`);
                    return NextResponse.json({ redirect: `/${data.roomId}` });
                } else {
                    console.error("Server did not return a valid room ID.");
                    return NextResponse.json({ error: "Failed to create a room. Please try again." }, { status: 500 });
                }
            } else {
                // Handle server errors (e.g., 409, 500)
                const errorText = await res.text();
                console.error(`Server error: ${res.status} ${errorText}`);
                return NextResponse.json({ error: "Failed to create a room. Please try again." }, { status: res.status });
            }
        } catch (error) {
            // Handle network or other unexpected errors
            console.error("Error creating room:", error);
            return NextResponse.json({ error: "An unexpected error occurred. Please try again." }, { status: 500 });
        }
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

