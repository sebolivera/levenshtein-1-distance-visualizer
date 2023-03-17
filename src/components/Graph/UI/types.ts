interface RectButton {
    x: number;
    y: number;
    w: number;
    h: number;
    isHovered: boolean;
}

interface PolarCoordinates {
    θ: number,
    r: number,
};

interface RectCoordinates {
    x: number,
    y: number,
}

export type { RectButton, RectCoordinates, PolarCoordinates };
