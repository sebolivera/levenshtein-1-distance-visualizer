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

export { lerp, isInCircle, isInRect};
