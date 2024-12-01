import { Vector3 } from "three";

export function mapToVector3(position: [number, number], y: number = 0): Vector3 {
    const [x, z] = position;
    return new Vector3(x, y, z);
}