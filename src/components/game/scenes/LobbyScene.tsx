'use client';

import { OrbitControls, OrthographicCamera, PerspectiveCamera } from '@react-three/drei';
import { Stage } from '../components/Stage';
import { EnemyTank } from '../components/EnemyTank';
import { MenuTank } from '@/components/canvas/MenuTank';
import { PlayerTank } from '../components/PlayerTank';
import { PlayerTankHandler } from '../components/PlayerTankHandler';


export default function LobbyScene() {
    return (
        <>

            <OrthographicCamera
                makeDefault
                position={[0, 5, 5]}
                rotation={[-Math.PI / 4, 0, 0]}
                zoom={230}
            />
            <OrbitControls />
            {/* Stage */}
            <Stage position={[0.1, -0.07, -0.7]} />

            <PlayerTankHandler
                position={[0, 0, 0]}
                bodyDirection={1}
                headDirection={3}
                isLocalPlayer={false}
                name={'test'}
                playerColor={'blue'} >
            </PlayerTankHandler>



            {/* Lights */}
            <pointLight intensity={40} position={[0, 5, 7]} castShadow receiveShadow />
            <ambientLight intensity={0.2} castShadow />
            <spotLight
                position={[0, 10, 0]}
                angle={0.7}
                penumbra={1}
                intensity={200}
                castShadow
                receiveShadow
            />


        </>
    );
}
