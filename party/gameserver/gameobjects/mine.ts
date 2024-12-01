
import { GameObject } from "./gameObjectBase";

export class Mine extends GameObject {
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
