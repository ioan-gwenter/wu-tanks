import { Vector2, Vector3 } from "three";

export function mapToVector3(position: Vector2, y: number = 0): Vector3 {
    return new Vector3(position.x, y, position.y);
}
// Merge deltas into the current state
export const mergeDeltas = <T>(
    current: { [id: string]: T },
    deltas?: { [id: string]: Partial<T> | null }
): { [id: string]: T } => {
    if (!deltas) return current;

    const updated = { ...current };

    for (const id in deltas) {
        const delta = deltas[id];

        if (delta === null) {
            // Remove the object if delta is null
            delete updated[id];
        } else {
            // Update or add the object with merged changes
            updated[id] = {
                ...(updated[id] || {}), // Existing object or empty object
                ...delta,              // Apply changes
            } as T;
        }
    }

    return updated;
};

