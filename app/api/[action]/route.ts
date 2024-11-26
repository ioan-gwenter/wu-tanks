import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { action: string } }) {
    const { action } = params;
    const body = await req.json();

    if (action === "join") {
        const { gameId } = body;

        if (!gameId || gameId.trim() === "") {
            return NextResponse.json({ error: "Invalid Game ID" }, { status: 400 });
        }

        // Additional server-side validation if necessary
        return NextResponse.json({ redirect: `/${gameId}` });
    }

    if (action === "create") {
        // TODO: request partykit server for a new code
        const newGameId = generateRandomGameId();
        return NextResponse.json({ redirect: `/${newGameId}` });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

const generateRandomGameId = (): string => {
    return Math.random().toString(36).substring(2, 10);
};
