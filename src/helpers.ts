import { BoardShape } from "./types/boardShape";

export const rectBoundingBox = (shape: BoardShape) => {
    const { x, y, width, height, rotation = 0 } = shape;
    const _degrees = rotation > 0 ? rotation : 360 + rotation;
    const rotationInRadians = (_degrees) * Math.PI / 180;

    const p1 = { x, y };
    const p2 = rotatePoint({ x: x + width, y }, { x, y }, rotationInRadians);
    const p3 = rotatePoint({ x: x + width, y: y + height }, { x, y }, rotationInRadians);
    const p4 = rotatePoint({ x, y: y + height }, { x, y }, rotationInRadians);

    const topLeft = {
        x: Math.min(p1.x, p2.x, p3.x, p4.x),
        y: Math.min(p1.y, p2.y, p3.y, p4.y),
    };

    const bottomRight = {
        x: Math.max(p1.x, p2.x, p3.x, p4.x),
        y: Math.max(p1.y, p2.y, p3.y, p4.y),
    };

    const boundRectHeight = bottomRight.y - topLeft.y;
    const boundRectWidth = bottomRight.x - topLeft.x;

    const boundingRect = {
        x: topLeft.x,
        y: topLeft.y,
        width: boundRectWidth,
        height: boundRectHeight,
    };

    return boundingRect
}

const rotatePoint = (point: { x: number, y: number }, origin: { x: number, y: number }, angle: number) => {
    const x = Math.cos(angle) * (point.x - origin.x) - Math.sin(angle) * (point.y - origin.y) + origin.x;
    const y = Math.sin(angle) * (point.x - origin.x) + Math.cos(angle) * (point.y - origin.y) + origin.y;
    return { x, y };
}

