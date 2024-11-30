import { Tank } from "@/components/game/gameTypes";



export interface TankData {
    id: string;
    position: [number, number, number];
    bodyRotation: number;
    headRotation: number;
    isDead: boolean;
    isFiring: boolean;
    isPlacingMine: boolean;
}

export type BulletData = {
    id: string;
    position: [number, number];
    rotation: [number];
    bounces: number;
};

export type MineData = {
    id: string;
    position: [number, number];
};

export type gameState = {
    tanks: { [id: string]: TankData };
    bullets: Array<{ id: string; position: [number, number], rotation: [number], bounces: number }>;
    mines: Array<{ id: string; position: [number, number] }>;
}