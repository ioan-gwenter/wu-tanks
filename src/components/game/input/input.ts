import { useEffect, useState } from "react";
import { Vector2, Vector3 } from "three";

export function usePressedKeys() {
    const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            setPressedKeys((prev) => new Set(prev).add(event.key));
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

export function useMousePosition() {
    const [mousePosition, setMousePosition] = useState<Vector2>(new Vector2(0, 0));

    useEffect(() => {
        const onMouseMove = (event: MouseEvent) => {
            // Update mouse position
            setMousePosition(new Vector2(event.clientX, event.clientY));
        };

        window.addEventListener("mousemove", onMouseMove);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
        };
    }, []);

    return mousePosition;
}

export function pressedKeysToVector(pressedKeys: Set<string>): Vector2 {
    const vector = new Vector2(0, 0);

    // UP
    if (
        pressedKeys.has("w") ||
        pressedKeys.has("W") ||
        pressedKeys.has("ArrowUp")
    ) {
        vector.y -= 1;
    }

    // LEFT
    if (
        pressedKeys.has("a") ||
        pressedKeys.has("A") ||
        pressedKeys.has("ArrowLeft")
    ) {
        vector.x -= 1;
    }

    // DOWN
    if (
        pressedKeys.has("s") ||
        pressedKeys.has("S") ||
        pressedKeys.has("ArrowDown")
    ) {
        vector.y += 1;
    }

    // RIGHT
    if (
        pressedKeys.has("d") ||
        pressedKeys.has("D") ||
        pressedKeys.has("ArrowRight")
    ) {
        vector.x += 1;
    }

    return vector;
}