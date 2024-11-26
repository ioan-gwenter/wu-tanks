'use client'

import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

export function MenuTank(props) {
  const { scene } = useGLTF('/models/PlayerTank.glb')

  useFrame((state, delta) => (scene.rotation.y += delta))

  return <primitive object={scene} {...props} />
}

