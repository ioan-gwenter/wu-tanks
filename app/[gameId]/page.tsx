import { GameScene } from "@/components/game/GameScene";
import { InvalidGame } from "@/components/game/InvalidGame";
import { isValidGameId } from "./helper";


export default async function GamePage({
    params: { gameId },
}: {
    params: { gameId: string },
}) {

    if (!isValidGameId(gameId)) {
        return < InvalidGame />;
    }

    return <GameScene gameId={gameId} />;
}