import { useEffect, useState } from "react";
import { Vector2 } from "three";

// Key press tracking
export function usePressedKeys() {
    const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            setPressedKeys((prev) => {
                const newSet = new Set(prev);
                newSet.add(event.key);
                return newSet;
            });
        };

        const onKeyUp = (event: KeyboardEvent) => {
            setPressedKeys((prev) => {
                const newSet = new Set(prev);
                newSet.delete(event.key);
                return newSet;
            });
        };

        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
        };
    }, []);

    return pressedKeys;
}

// Mouse position tracking
export function useMousePosition() {
    const [mousePosition, setMousePosition] = useState<Vector2>(new Vector2(0, 0));

    useEffect(() => {
        const onMouseMove = (event: MouseEvent) => {
            setMousePosition(new Vector2(event.clientX, event.clientY));
        };

        window.addEventListener("mousemove", onMouseMove);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
        };
    }, []);

    return mousePosition;
}

// Convert pressed keys to a direction vector
export function pressedKeysToVector(pressedKeys: Set<string>): Vector2 {
    const vector = new Vector2(0, 0);

    if (pressedKeys.has("w") || pressedKeys.has("W") || pressedKeys.has("ArrowUp")) vector.y -= 1;
    if (pressedKeys.has("a") || pressedKeys.has("A") || pressedKeys.has("ArrowLeft")) vector.x -= 1;
    if (pressedKeys.has("s") || pressedKeys.has("S") || pressedKeys.has("ArrowDown")) vector.y += 1;
    if (pressedKeys.has("d") || pressedKeys.has("D") || pressedKeys.has("ArrowRight")) vector.x += 1;

    return vector;
}
