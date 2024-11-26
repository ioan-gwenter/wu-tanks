import { InvalidGame } from "@/components/game/scenes/InvalidGame";
import { isValidGameId } from "../util/landingPageHelper";
import { SessionManager } from "@/components/game/SessionManager";


export default async function GamePage({
    params: { gameId },
}: {
    params: { gameId: string },
}) {

    if (!isValidGameId(gameId)) {
        return < InvalidGame />;
    }

    return <SessionManager gameId={gameId} />;
}