import { OrbitControls } from "@react-three/drei/core/OrbitControls";
import { OrthographicCamera } from "@react-three/drei/core/OrthographicCamera";
import { Stage } from "./Stage";


interface DefaultBackdropProps {
    cameraPosition?: [number, number, number];
    cameraRotation?: [number, number, number];
    zoom?: number;
    stagePosition?: [number, number, number];
    pointLightPosition?: [number, number, number];
    pointLightIntensity?: number;
    ambientLightIntensity?: number;
    spotLightPosition?: [number, number, number];
    spotLightIntensity?: number;
}

export default function DefaultBackdrop({
    cameraPosition = [0, 5, 5],
    zoom = 200,
    stagePosition = [0.01, -0.07, -0.9],
    pointLightPosition = [0, 5, 7],
    pointLightIntensity = 40,
    ambientLightIntensity = 0.2,
    spotLightPosition = [0, 10, 0],
    spotLightIntensity = 200,
}: DefaultBackdropProps) {
    return (
        <>
            {/* Camera */}
            <OrthographicCamera
                makeDefault
                position={cameraPosition}
                zoom={zoom}
            />
            <OrbitControls />

            {/* Stage */}
            <Stage position={stagePosition} scale={[1.02, 1, 1]} />

            {/* Lights */}
            <pointLight
                intensity={pointLightIntensity}
                position={pointLightPosition}
                castShadow
                receiveShadow
            />
            <ambientLight intensity={ambientLightIntensity} castShadow />
            <spotLight
                position={spotLightPosition}
                angle={0.7}
                penumbra={1}
                intensity={spotLightIntensity}
                castShadow
                receiveShadow
            />
        </>
    );
}
