'use client';

// import { OrbitControls, OrthographicCamera, PerspectiveCamera } from '@react-three/drei';
// import { Stage } from '../components/Stage';
// import { EnemyTank } from '../components/EnemyTank';
import { PlayerTankHandler } from '../components/PlayerTankHandler';
import DefaultBackdrop from '../components/DefaultBackdrop';
import { MenuTank } from '@/components/canvas/MenuTank';
import { EnemyTank } from '../components/EnemyTank';



export default function LobbyScene({ gameState }) {
    return (
        <>
            <DefaultBackdrop zoom={160} />
            {gameState.tanks.map((tank) => (
                <PlayerTankHandler
                    key={tank.id}
                    position={tank.position}
                    headRotation={tank.headRotation}
                    bodyRotation={tank.bodyRotation}
                />
            ))}
        </>
    );
}
