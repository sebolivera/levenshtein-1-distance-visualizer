import { useState, useEffect } from "react";

const getDimensions = (): [number, number] => {
    return [
        window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth,
        window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight,
    ];
};


export default function useDimensions() {
    // Partially stolen from https://dev.to/vitaliemaldur/resize-event-listener-using-react-hooks-1k0c
    // save current window width in the state object
    let [dimensions, setDimensions] = useState<[number, number]>(
        getDimensions()
    );
    useEffect(() => {
        let timeoutId: number;
        const resizeListener = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => setDimensions(getDimensions()), 150);
        };
        window.addEventListener("resize", resizeListener);

        return () => {
            window.removeEventListener("resize", resizeListener);
        };
    }, []);

    return dimensions;
}
