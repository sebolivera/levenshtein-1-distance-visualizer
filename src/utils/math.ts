const lerp = (a: number, b: number, t: number): number => {
    return (1 - t) * a + t * b;
};

const isInCircle = (
    cursor: [number, number],
    circle: [number, number, number]
): boolean => {
    return (
        Math.abs(circle[0] - cursor[0]) + Math.abs(circle[1] - cursor[1]) <=
        circle[2]
    );
};

const isInRect = (
    cursor: [number, number],
    rect: [number, number, number, number]
): boolean => {
    return (
        cursor[0] > rect[0] &&
        cursor[0] < rect[0] + rect[2] &&
        cursor[1] > rect[1] &&
        cursor[1] < rect[1] + rect[3]
    );
};

const getAmplitude = (p1: [number, number], p2: [number, number]): number => {
    return Math.sqrt((p2[0] - p1[0]) ** 2 + (p2[1] - p1[1]) ** 2);
};

export { lerp, isInCircle, isInRect, getAmplitude };
