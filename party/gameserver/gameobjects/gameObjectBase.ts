export abstract class GameObject {

    constructor() { }

    // Update common properties
    updateState(): void {
    }

    // Abstract method for exporting a payload
    abstract getStatePayload(): Record<string, any>;
}