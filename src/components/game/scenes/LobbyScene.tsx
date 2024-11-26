'use client';

import { OrbitControls, OrthographicCamera, PerspectiveCamera } from '@react-three/drei';
import { Stage } from '../components/Stage';
import { EnemyTank } from '../components/EnemyTank';
import { MenuTank } from '@/components/canvas/MenuTank';
import { PlayerTank } from '../components/PlayerTank';


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


            <Stage position={[0.1, 0, -0.7]} />
            <EnemyTank position={[0, 0.11, 0]} rotation={[0, Math.PI / 2, 0]} enemyColor='red' />
            <PlayerTank position={[0, 0.11, 2]} rotation={[0, Math.PI / 2, 0]} playerColor='blue' />


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
