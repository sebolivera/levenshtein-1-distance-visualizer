const isInCircle = (
    cursor: [number, number],
    circle: [number, number, number]
): boolean => {
    return (
        Math.abs(circle[0] - cursor[0]) + Math.abs(circle[1] - cursor[1]) <=
        circle[2]
    );
};

const rectToPolar = (
    p1: [number, number],
    p2: [number, number]
): [number, number] => {
    let r: number = getAmplitude(p2, p1);
    let θ: number = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
    return [θ, r];
};

const applyPolar = (
    point: [number, number],
    vect: [number, number],
    factor?: number,
    inputRatio?: number
): [number, number] => {
    let ratio: number = inputRatio ?? 1;
    if (ratio === 0) {
        ratio = 1;
    }
    return [
        point[0] + (factor ?? 1) * (vect[1] / ratio) * Math.cos(vect[0]),
        point[1] + (factor ?? 1) * (vect[1] / ratio) * Math.sin(vect[0]),
    ];
};
const getAmplitude = (p1: [number, number], p2: [number, number]): number => {
    return Math.sqrt((p2[0] - p1[0]) ** 2 + (p2[1] - p1[1]) ** 2);
};

const circlesOverlap = (
    c1: [number, number, number],
    c2: [number, number, number]
): boolean => {
    return rectToPolar([c2[0], c2[1]], [c1[0], c1[0]])[1] < c1[2] + c2[2];
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

export { isInCircle, isInRect, rectToPolar, applyPolar };
