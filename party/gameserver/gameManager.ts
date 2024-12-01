import { Bullet } from "./gameobjects/bullet";
import { Mine } from "./gameobjects/mine";
import { Tank } from "./gameobjects/tank";

type GameState = "LOBBY" | "GAME" | "GAME_OVER";

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

        this.tanks[tankId] = new Tank({});
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
        if (!tank) return;

        // Apply latency compensation
        const adjustedTimestamp = Date.now() - latency;

        // switch (input.type) {
        //     case "MOVE":
        //         tank.move(input.direction, adjustedTimestamp);
        //         break;
        //     // case "FIRE":
        //     //     this.spawnBullet(clientId, input.target, adjustedTimestamp);
        //     //     break;
        //     // case "PLACE_MINE":
        //     //     this.spawnMine(clientId, input.position, adjustedTimestamp);
        //     //     break;
        // }
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

        // Update previous state for the next tick
        this.previousState = {
            tanks: { ...this.tanks },
            bullets: { ...this.bullets },
            mines: { ...this.mines },
        };

        // Return the deltas
        return {
            tanks: tanksDelta,
            bullets: bulletsDelta,
            mines: minesDelta,
        };
    }

    // Delta calculation logic
    private getDelta<T>(
        current: { [id: string]: T },
        previous: { [id: string]: T }
    ): { [id: string]: Partial<T> } {
        const delta: { [id: string]: Partial<T> } = {};

        for (const id in current) {
            if (!previous[id]) {
                delta[id] = current[id];
            } else {
                const changes: Partial<T> = {};
                for (const key in current[id]) {
                    if (current[id][key] !== previous[id][key]) {
                        changes[key] = current[id][key];
                    }
                }
                if (Object.keys(changes).length > 0) {
                    delta[id] = changes;
                }
            }
        }

        for (const id in previous) {
            if (!current[id]) {
                delta[id] = null; // Mark as removed
            }
        }

        return delta;
    }

    // // Spawn a bullet
    // private spawnBullet(ownerId: string, target: [number, number], timestamp: number): void {
    //     const bulletId = `${ownerId}-${timestamp}`;
    //     this.bullets[bulletId] = new Bullet(this.tanks[ownerId].getPosition(), target, timestamp);
    // }

    // // Spawn a mine
    // private spawnMine(ownerId: string, position: [number, number], timestamp: number): void {
    //     const mineId = `${ownerId}-${timestamp}`;
    //     this.mines[mineId] = new Mine(position);
    // }

    // Process physics TODO
    private processPhysics(): void {
    }
}
