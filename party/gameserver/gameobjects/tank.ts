import { Vector2 } from "three";
import { GameObject } from "./gameObjectBase";

interface TankOptions {
    position?: Vector2;
    velocity?: Vector2;
    bodyRotation?: number;
    headRotation?: number;
    color?: string;
    isDead?: boolean;
    isFiring?: boolean;
    isPlacingMine?: boolean;
}

export class Tank extends GameObject {
    private position: Vector2;
    private velocity: Vector2;
    private bodyRotation: number;
    private headRotation: number;
    private color: string;
    private isDead: boolean;
    private isFiring: boolean;
    private isPlacingMine: boolean;

    private lastUpdateTime: number;

    constructor({
        position = new Vector2(0, 0),
        velocity = new Vector2(0, 0),
        bodyRotation = 0,
        headRotation = 0,
        color = "#FFFFFF",
        isDead = false,
        isFiring = false,
        isPlacingMine = false,
    }: TankOptions) {
        super();

        this.position = position;
        this.velocity = velocity;
        this.bodyRotation = bodyRotation;
        this.headRotation = headRotation;
        this.color = color;
        this.isDead = isDead;
        this.isFiring = isFiring;
        this.isPlacingMine = isPlacingMine;

        this.lastUpdateTime = Date.now();
    }

    // Update the tank's movement based on direction and timestamp
    move(direction: Vector2, timestamp: number): void {
        const timeDelta = (timestamp - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = timestamp;

        // Update velocity based on direction
        this.velocity.copy(direction.clone().multiplyScalar(0.1));

        // Update position based on velocity and time delta
        this.position.add(this.velocity.clone());
    }

    getPosition(): Vector2 {
        return this.position.clone(); // Return a copy to prevent external mutations
    }

    // Stop movement (optional, for when no input is received)
    stop(): void {
        this.velocity.set(0, 0);
    }

    updateState(): void {

    }

    getStatePayload(): any {
    }
}
