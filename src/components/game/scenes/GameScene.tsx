'use client';

import DefaultBackdrop from '../components/DefaultBackdrop';
import { PlayerTankHandler } from '../components/PlayerTankHandler';
import { EnemyTank } from '../components/EnemyTank';
import { GameSceneProps, GameState } from '../helpers/gameTypes';
import { mapToVector3 } from '../helpers/gameHelper';

const GameScene: React.FC<GameSceneProps> = ({ gameState }) => {
    return (
        <>
            {/* Backdrop */}
            <DefaultBackdrop zoom={160} />

            {/* Render Tanks */}
            {Object.entries(gameState.tanks).map(([id, tank]) => {
                const isPlayerTank = !id.startsWith("enemy"); // Determine if it's a player tank
                return isPlayerTank ? (
                    <PlayerTankHandler
                        key={id}
                        position={mapToVector3(tank.position)}
                        headRotation={tank.headRotation}
                        bodyRotation={tank.bodyRotation}
                        playerColor={tank.color}
                    />
                ) : (
                    <EnemyTank
                        key={id}
                        position={mapToVector3(tank.position)}
                        headRotation={tank.headRotation}
                        bodyRotation={tank.bodyRotation}
                        color={tank.color}
                    />
                );
            })}
        </>
    );
};

export default GameScene;