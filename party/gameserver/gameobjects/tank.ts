import { GameObject } from "./gameObjectBase";

interface TankOptions {
    position?: [number, number];
    velocity?: [number, number];
    bodyRotation?: number;
    headRotation?: number;
    color?: string;
    isDead?: boolean;
    isFiring?: boolean;
    isPlacingMine?: boolean;
}

export class Tank extends GameObject {
    private position: [number, number];
    private velocity: [number, number];
    private bodyRotation: number;
    private headRotation: number;
    private color: string;
    private isDead: boolean;
    private isFiring: boolean;
    private isPlacingMine: boolean;

    private lastUpdateTime: number;

    constructor({
        position = [0, 0],
        velocity = [0, 0],
        bodyRotation = 0,
        headRotation,
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
    move(direction: [number, number], timestamp: number): void {
        const timeDelta = (timestamp - this.lastUpdateTime) / 1000; // Convert to seconds
        this.lastUpdateTime = timestamp;

        // Update velocity based on direction (e.g., normalized direction vector)
        this.velocity = [direction[0] * 0.1, direction[1] * 0.1]; // Example speed multiplier

        // Update position based on velocity and time delta
        this.position = [
            this.position[0] + this.velocity[0] * timeDelta,
            this.position[1] + this.velocity[1] * timeDelta,
        ];
    }

    // Getter for the current position
    getPosition(): [number, number] {
        return this.position;
    }

    // Stop movement (optional, for when no input is received)
    stop(): void {
        this.velocity = [0, 0];
    }

    updateState(): void {

    }

    getStatePayload(): any {
    }
}
