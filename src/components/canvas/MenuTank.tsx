'use client'

import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRouter } from 'next/router'

export function MenuTank(props) {
  const { scene } = useGLTF('/models/PlayerTank.glb')
  useFrame((state, delta) => (scene.rotation.y += delta))

  return <primitive object={scene} {...props} />
}
