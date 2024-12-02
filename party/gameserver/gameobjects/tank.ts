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
    private isRotating: boolean; // Indicates whether the tank is rotating to align
    private rotationTarget: number; // Target rotation angle
    private rotationSpeed: number; // Speed of rotation adjustment (radians per frame)
    private readonly rotationOffset: number; // Offset for aligning the model's direction
    private intendedDirection: Vector2 | null; // Stores the direction while rotating

    constructor({
        position = new Vector2(0, 0),
        velocity = new Vector2(0, 0),
        bodyRotation = 0,
        headRotation = 0,
        color = "#000000",
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
        this.isRotating = false;
        this.rotationTarget = 0;
        this.rotationSpeed = 0.4;
        this.rotationOffset = Math.PI / 2; // Offset to correct rotation alignment
        this.intendedDirection = null;
    }

    private normalizeAngle(angle: number): number {
        // Normalize the angle to the range [-π, π]
        return (angle + Math.PI / 2) % (2 * Math.PI) - Math.PI / 2;
    }

    // Update the tank's movement based on direction and timestamp
    move(direction: Vector2, timestamp: number): void {
        if (this.isRotating) {
            // Store the intended direction while rotating
            this.intendedDirection = direction.clone();
            return;
        }

        const timeDelta = (timestamp - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = timestamp;

        const newVelocity = direction.clone();
        if (newVelocity.length() > 0) {
            newVelocity.normalize().multiplyScalar(0.04); // Adjust speed multiplier as needed
        }

        // Update velocity
        this.velocity.copy(newVelocity);

        // Calculate the target rotation
        if (this.velocity.length() > 0) {
            const targetRotation = this.normalizeAngle(Math.atan2(this.velocity.y, this.velocity.x) + this.rotationOffset);

            const angleDifference = this.normalizeAngle(targetRotation - this.bodyRotation);

            // Check if the angle difference exceeds the threshold
            const threshold = Math.PI / 4;
            if (Math.abs(angleDifference) > threshold) {
                this.isRotating = true;
                this.rotationTarget = targetRotation;
            }
        }
    }

    updateState(): void {
        const now = Date.now();
        const deltaTime = (now - this.lastUpdateTime) / 1000;

        if (this.isRotating) {
            // Align rotation in the shortest direction
            const angleDifference = this.normalizeAngle(this.rotationTarget - this.bodyRotation);

            if (Math.abs(angleDifference) < 0.01) {
                // Close enough to the target rotation
                this.bodyRotation = this.rotationTarget;
                this.isRotating = false; // Finish rotating

                // Resume movement with the intended direction
                if (this.intendedDirection) {
                    this.move(this.intendedDirection, now);
                    this.intendedDirection = null; // Clear the stored direction
                }
            } else {
                // Smoothly adjust rotation in the shortest direction
                const rotationStep = Math.sign(angleDifference) * Math.min(this.rotationSpeed, Math.abs(angleDifference));
                this.bodyRotation += rotationStep;
                this.bodyRotation = this.normalizeAngle(this.bodyRotation); // Keep within [-π, π]
            }
        } else {
            // Update position if not rotating
            this.position.add(this.velocity.clone());
        }

        // Example: Update head rotation independently
        this.headRotation += 0.01;
    }

    getPosition(): Vector2 {
        return this.position.clone(); // Return a copy to prevent external mutations
    }

    stop(): void {
        this.velocity.set(0, 0);
    }

    getStatePayload(): any {
        return {
            position: this.position.clone(),
            velocity: this.velocity.clone(),
            bodyRotation: this.bodyRotation,
            headRotation: this.headRotation,
            color: this.color,
            isDead: this.isDead,
            isFiring: this.isFiring,
            isPlacingMine: this.isPlacingMine,
        };
    }
}
