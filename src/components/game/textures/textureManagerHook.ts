import { useTexture } from '@react-three/drei';

export const useUniversalTextures = () => {
    const textures = useTexture({
        map: '/models/textures/wood2.jpg',
    });

    return textures;
};