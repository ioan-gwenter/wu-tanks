import { Vector2 } from "three";
import { Bullet } from "./gameobjects/bullet";
import { Mine } from "./gameobjects/mine";
import { Tank } from "./gameobjects/tank";

function generatePastelColor(): string {
    const randomComponent = () => Math.floor(Math.random() * 255); // Range: 127-255
    const red = randomComponent();
    const green = randomComponent();
    const blue = randomComponent();
    return `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;
}

type GameState = "LOBBY" | "GAME" | "GAME_OVER";

function deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

interface InputMessage {
    clientId: string;
    input: any;
    timestamp: number;
    latency: number;
}

interface DeltaUpdate {
    tanks?: { [id: string]: Partial<Tank> };
    bullets?: { [id: string]: Partial<Bullet> };
    mines?: { [id: string]: Partial<Mine> };
}

export default class GameStateManager {
    private state: GameState = "LOBBY";
    private tanks: { [id: string]: Tank } = {};
    private bullets: { [id: string]: Bullet } = {};
    private mines: { [id: string]: Mine } = {};
    private currentRound: number = 0;
    private currentMap: number[][] = [];

    private sequenceNumber: number = 0;
    private inputBuffer: InputMessage[] = [];

    private previousState: {
        tanks: { [id: string]: Tank };
        bullets: { [id: string]: Bullet };
        mines: { [id: string]: Mine };
    };

    constructor() {
        this.previousState = {
            tanks: {},
            bullets: {},
            mines: {},
        };
    }

    addTank(tankId: string): void {
        if (this.tanks[tankId]) {
            console.warn(`Tank with ID ${tankId} already exists.`);
            return;
        }

        this.tanks[tankId] = new Tank({ color: generatePastelColor() });
        console.log(`Tank with ID ${tankId} Created`);
    }

    getSequence(): number {
        return this.sequenceNumber;
    }

    addInput(clientId: string, input: any, timestamp: number, latency: number): void {
        this.inputBuffer.push({ clientId, input, timestamp, latency });
    }

    // Process all buffered inputs
    processInputs(): void {
        for (const { clientId, input, timestamp, latency } of this.inputBuffer) {
            this.processInput(clientId, input, latency, timestamp);
        }
        this.inputBuffer = [];
    }

    // Process a single input with latency compensation
    private processInput(clientId: string, input: any, latency: number, timestamp: number): void {
        const tank = this.tanks[clientId];
        if (!tank) return; // If the tank doesn't exist, do nothing

        // Apply latency compensation
        const adjustedTimestamp = Date.now() - latency;

        if (input.movementInput) {
            const { x, y } = input.movementInput;


            // Validate that x and y are numbers
            if (typeof x === "number" && typeof y === "number") {
                // Pass the movement direction to the tank
                tank.move(new Vector2(x, y), adjustedTimestamp);

            } else {
                console.warn(`Invalid movementInput data for clientId: ${clientId}. Expected numbers for x and y.`);
            }
        }

    }

    // Update game state (called every tick)
    update(timestamp: number): void {
        this.processPhysics();
        this.sequenceNumber++;
    }

    // Generate delta updates
    generateDeltas(): DeltaUpdate | null {
        const tanksDelta = this.getDelta(this.tanks, this.previousState.tanks);
        const bulletsDelta = this.getDelta(this.bullets, this.previousState.bullets);
        const minesDelta = this.getDelta(this.mines, this.previousState.mines);

        // Check if there are any deltas
        if (
            Object.keys(tanksDelta).length === 0 &&
            Object.keys(bulletsDelta).length === 0 &&
            Object.keys(minesDelta).length === 0
        ) {
            return null; // No deltas to return
        }

        // Deep copy the current state to update previousState
        this.previousState = {
            tanks: deepClone(this.tanks),
            bullets: deepClone(this.bullets),
            mines: deepClone(this.mines),
        };

        // Return the deltas
        return {
            tanks: tanksDelta,
            bullets: bulletsDelta,
            mines: minesDelta,
        };
    }

    private getDelta<T>(
        current: { [id: string]: T },
        previous: { [id: string]: T }
    ): { [id: string]: Partial<T> } {
        const delta: { [id: string]: Partial<T> } = {};

        // Check for new or updated objects
        for (const id in current) {
            if (!previous[id]) {
                // If the object is new, add it entirely to the delta
                delta[id] = current[id];
            } else {
                // If the object exists, check for changes
                const changes: Partial<T> = {};
                for (const key in current[id]) {
                    if (current[id][key] !== previous[id][key]) {
                        // Record any changed properties
                        changes[key] = current[id][key];
                    }
                }
                if (Object.keys(changes).length > 0) {
                    delta[id] = changes;
                }
            }
        }

        // Check for removed objects
        for (const id in previous) {
            if (!current[id]) {
                // If an object exists in previous but not in current, mark it as removed
                delta[id] = null;
            }
        }

        return delta;
    }




    // Process physics TODO
    private processPhysics(): void {
        for (const tankId in this.tanks) {
            const tank = this.tanks[tankId];
            if (tank) {
                tank.updateState();
            }
        }
    }
}
