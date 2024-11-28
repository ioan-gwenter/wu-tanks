import * as THREE from 'three'
import React from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
    nodes: {
        Scene_2: THREE.Mesh
        Scene_3: THREE.Mesh
        Scene_4: THREE.Mesh
    }
    materials: {
        ['Wood1.005']: THREE.MeshStandardMaterial
        ['Wood3.001']: THREE.MeshStandardMaterial
    }
}

export function Stage(props: JSX.IntrinsicElements['group']) {
    const { nodes, materials } = useGLTF('/models/Stage.glb') as GLTFResult
    return (
        <group {...props} dispose={null}>
            <group name="Scene">
                <group name="Scene_1" rotation={[0, 0, 0]} scale={[3.901, 1.67, 4.02]}>
                    <mesh
                        name="Scene_2"
                        castShadow
                        receiveShadow
                        geometry={nodes.Scene_2.geometry}
                        material={materials['Wood1.005']}
                    />
                    <mesh
                        name="Scene_3"
                        castShadow
                        receiveShadow
                        geometry={nodes.Scene_3.geometry}
                        material={materials['Wood3.001']}
                    />
                    <mesh
                        name="Scene_4"
                        castShadow
                        receiveShadow
                        geometry={nodes.Scene_4.geometry}
                        material={materials['Wood3.001']}
                    />
                </group>
            </group>
        </group>
    )
}
