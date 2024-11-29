'use client';

import { OrbitControls, OrthographicCamera, PerspectiveCamera } from '@react-three/drei';
import { Stage } from '../components/Stage';
import { EnemyTank } from '../components/EnemyTank';
import { PlayerTankHandler } from '../components/PlayerTankHandler';
import DefaultBackdrop from '../components/DefaultBackdrop';



export default function LobbyScene() {

    return (
        <>
            <DefaultBackdrop />
            <PlayerTankHandler position={[0, 0, 0]} />
            <EnemyTank position={[0, 0, -1.45]} />
        </>
    );
}
