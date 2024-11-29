import { forwardRef } from "react";
import { Group, Quaternion } from "three";
import { PlayerTank } from "./PlayerTank";

export const PlayerTankHandler = forwardRef<
    Group | null,
    {
        bodyRotation?: number;
        headRotation?: number;
        position?: [number, number, number];
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