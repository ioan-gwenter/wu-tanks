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
            <PlayerTankHandler position={[0, 0, 0.17 * -9]} />
            <PlayerTankHandler position={[0.17 * -11, 0, 0.17 * -9]} />
            <EnemyTank position={[0, 0, -1.45]} />



        </>
    );
}
