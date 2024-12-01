import { forwardRef } from "react";
import { Group, Quaternion } from "three";
import { PlayerTank } from "./PlayerTank";
import { Vector3 } from "@react-three/fiber";

export const PlayerTankHandler = forwardRef<
    Group | null,
    {
        bodyRotation?: number;
        headRotation?: number;
        position?: Vector3;
        isLocalPlayer?: boolean;
        name?: string;
        playerColor?: string;
    }
>(function PlayerTankHandler(
    { bodyRotation, headRotation, position, isLocalPlayer, name, playerColor },
    ref
) {
    return (
        <group ref={ref} position={position} >
            <PlayerTank bodyRotation={bodyRotation} headRotation={headRotation} position={position} playerColor={playerColor} />
        </group>
    );
});