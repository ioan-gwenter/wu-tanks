
import { GameObject } from "./gameObjectBase";

export class Bullet extends GameObject {
    private position: [number, number];

    constructor(
        position: [number, number]
    ) {
        super();
        this.position = position;
    }

    updateState(): void {

    }

    getStatePayload(): any {
    }
}
