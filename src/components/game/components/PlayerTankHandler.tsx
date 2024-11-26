import { forwardRef } from "react";
import { Group, Quaternion } from "three";
import { PlayerTank } from "./PlayerTank";

export const PlayerTankHandler = forwardRef<
    Group | null,
    {
        bodyDirection?: number;
        headDirection?: number;
        position?: [number, number, number];
        isLocalPlayer?: boolean;
        name?: string;
        playerColor?: string;
    }
>(function PlayerTankHandler(
    { bodyDirection, headDirection, position, isLocalPlayer, name, playerColor },
    ref
) {
    return (
        <group ref={ref} position={position} >
            <PlayerTank bodyDirection={bodyDirection} headDirection={headDirection} position={position} playerColor={playerColor} />
        </group>
    );
});