
export function isValidGameId(gameId: string) {
    const regex = /^[a-zA-Z0-9]{8}$/;
    return regex.test(gameId);
}

export const validateJoinGame = async (gameId: string): Promise<string | Error> => {
    console.log("join pressed")
    if (!gameId.trim()) {
        throw new Error("Please enter a valid Game ID.");
    }

    try {
        const response = await fetch("/api/join", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ gameId }),
        });

        if (!response.ok) {
            const { error } = await response.json();
            throw new Error(error || "An error occurred while joining the game.");
        }

        const { redirect } = await response.json();
        return redirect;
    } catch (error) {
        throw new Error(error.message || "An unexpected Join error occurred.");
    }
};

export const validateCreateGame = async (): Promise<string | Error> => {
    console.log("create pressed")
    try {
        const response = await fetch("/api/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify("create")
        });

        if (!response.ok) {
            const { error } = await response.json();
            throw new Error(error || "An error occurred while creating the game.");
        }

        const { redirect } = await response.json();
        return redirect;

    } catch (error) {
        throw new Error(error.message || "An unexpected Create error occurred.");
    }
};