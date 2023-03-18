import { useTheme } from "@mui/material/styles";
import { Box, CircularProgress } from "@mui/material";
import {
    MouseEvent as ReactMouseEvent,
    WheelEvent,
    Dispatch,
    useEffect,
    useRef,
    useState,
    SetStateAction,
} from "react";
import axios from "../config/axios";
import { isInRect } from "../utils/geometry";
import useDimensions from "../utils/useDimensions";
import { WordNode, CursorInfo } from "./Graph/logic/types";
import { RectButton } from "./Graph/UI/types";
import {
    createSubNode,
    getMaxNodeWeight,
    roughlyDistributeNodes,
    zoomNodes,
} from "./Graph/logic";
import { drawNodes, dragCanvas, highlightNodes, zoomCanvas } from "./Graph/UI";
import Backdrop from "@mui/material/Backdrop";

export default function Canvas(props: {
    word: string;
    radius: number;
    setWord: Dispatch<SetStateAction<string>>;
    repeats: number;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [sizeSet, setSizeSet] = useState<boolean>(false);
    const [canvasDim, setCanvasDim] = useState<DOMRect>();
    const [isCanvasClicked, setIsCanvasClicked] = useState<boolean>(false);
    const [wordNodes, setWordNodes] = useState<Record<string, WordNode>>({});
    const [wordNodesInit, setWordNodesInit] =
        useState<Record<string, WordNode>>(wordNodes);
    const theme = useTheme();
    const [centerCursorButtonInfo, setCenterCursorButtonInfo] =
        useState<RectButton>({
            x: 0,
            y: 0,
            w: 0,
            h: 0,
            isHovered: false,
        });
    const [loading, setLoading] = useState<boolean>(true);
    const [cursorInfo, setCursorInfo] = useState<CursorInfo>({
        xPos: 0,
        yPos: 0,
        xOffset: 0,
        yOffset: 0,
    });

    const [zoomFactor, setZoomFactor] = useState<number>(1);
    const [maxNodeWeight, setMaxNodeWeight] = useState<number>();
    let windowDimensions = useDimensions();

    //handlers

    const handleMouseMove = (
        e: ReactMouseEvent<HTMLCanvasElement, MouseEvent>
    ): void => {
        if (canvasDim) {
            const x = e.clientX - canvasDim.left;
            const y = e.clientY - canvasDim.top;
            setCursorInfo((prevState) => ({
                xPos: x,
                yPos: y,
                xOffset: prevState.xPos,
                yOffset: prevState.yPos,
            }));
        }
    };
    const handleMouseUnclick = (
        e: ReactMouseEvent<HTMLCanvasElement, MouseEvent>
    ) => {
        setIsCanvasClicked(false);
    };

    const handleMouseClick = (
        e: ReactMouseEvent<HTMLCanvasElement, MouseEvent>
    ) => {
        setIsCanvasClicked(true);
    };

    const handleCursorCenter = () => {
        setWordNodes(wordNodesInit); // technically not 100% following the flow, but it won't matter as the canvas is going to get re-rendered twice anyway.
        setZoomFactor(1);
    };

    const handleZoom = (e: WheelEvent<HTMLCanvasElement>) => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            if (ctx) {
                setZoomFactor(zoomCanvas(e.deltaY, zoomFactor));
            }
        }
    };

    //hooks

    useEffect(() => {
        for (let [word, node] of Object.entries(wordNodes)) {
            if (node.isHovered) {
                props.setWord(word);
            }
        }
    }, [isCanvasClicked]);

    useEffect(() => {
        setLoading(true);
        if (props.word && props.word.length > 0) {
            axios
                .get("/lev_dist/" + props.word + "/" + props.repeats)
                .then((res: Record<string, any>) => {
                    if (canvasRef.current) {
                        let center: [number, number] = Object.hasOwn(
                            wordNodes,
                            props.word
                        )
                            ? [wordNodes[props.word].x, wordNodes[props.word].y]
                            : [
                                  canvasRef.current.width / 2,
                                  canvasRef.current.height / 2,
                              ];
                        let nodes: Record<string, WordNode> = {
                            [props.word]: {
                                x: center[0],
                                y: center[1],
                                linkedWords: res.data[props.word],
                                isHovered: false,
                                color: theme.palette.error.main,
                            },
                        };
                        if (Object.keys(res.data).length > 0) {
                            for (let word of Object.keys(res.data)) {
                                //generates the immediate nodes found
                                if (word !== props.word) {
                                    nodes[word] = {
                                        x: 0,
                                        y: 0,
                                        linkedWords: res.data[word],
                                        isHovered: false,
                                        color: theme.palette.warning.main,
                                    };
                                }
                            }
                            for (let [word, node] of Object.entries(nodes)) {
                                //gets the "end" nodes, I.e. the words that were at the very end of the given number for the levenshtein distance
                                for (let subWord of node.linkedWords) {
                                    if (!Object.hasOwn(nodes, subWord)) {
                                        nodes[subWord] = createSubNode(
                                            subWord,
                                            word,
                                            res.data,
                                            theme
                                        );
                                    }
                                }
                            }
                            setWordNodesInit(
                                roughlyDistributeNodes(
                                    nodes,
                                    props.word,
                                    props.radius
                                )
                            );
                        }
                    }
                });
        }
    }, [props, windowDimensions]);

    useEffect(() => {
        setWordNodes(wordNodesInit);
    }, [wordNodesInit]);

    useEffect(() => {
        if (sizeSet && canvasRef.current) {
            setCanvasDim(canvasRef.current.getBoundingClientRect());
            setCenterCursorButtonInfo({
                x: canvasRef.current.width - 200,
                y: canvasRef.current.height - 100,
                w: 150,
                h: 75,
                isHovered: false,
            });
        }
    }, [sizeSet]);

    useEffect(() => {
        setSizeSet(true);
    }, [windowDimensions]);

    useEffect(() => {
        if (wordNodes && Object.keys(wordNodes).length > 0) {
            setMaxNodeWeight(getMaxNodeWeight(wordNodes));
            setLoading(false);
        }
    }, [wordNodes]);

    useEffect(() => {
        if (
            canvasRef.current &&
            wordNodes &&
            Object.keys(wordNodes).length > 0 &&
            maxNodeWeight &&
            maxNodeWeight !== 0
        ) {
            drawNodes(
                wordNodes,
                canvasRef.current,
                centerCursorButtonInfo,
                theme,
                props.radius
            );
        }
    }, [wordNodes, props.radius, theme, maxNodeWeight]);

    useEffect(() => {
        if (canvasRef.current) {
            if (!sizeSet) {
                canvasRef.current.style.width = "100%";
                canvasRef.current.style.height = "100%";
                canvasRef.current.width = canvasRef.current.offsetWidth;
                canvasRef.current.height = canvasRef.current.offsetHeight - 20;
                setSizeSet(true);
            }
        }
    }, [canvasRef]);

    const highlightCenterCursorButton = (cursorPos: [number, number]) => {
        setCenterCursorButtonInfo((prev) => ({
            ...prev,
            isHovered: isInRect(cursorPos, [
                centerCursorButtonInfo.x,
                centerCursorButtonInfo.y,
                centerCursorButtonInfo.w,
                centerCursorButtonInfo.h,
            ]),
        }));
    };

    useEffect(() => {
        isCanvasClicked
            ? setWordNodes(
                  dragCanvas(
                      [
                          -cursorInfo.xOffset + cursorInfo.xPos,
                          -cursorInfo.yOffset + cursorInfo.yPos,
                      ],
                      wordNodes
                  )
              )
            : setWordNodes(
                  highlightNodes(
                      [cursorInfo.xPos, cursorInfo.yPos],
                      wordNodes,
                      props.radius
                  )
              );
        highlightCenterCursorButton([cursorInfo.xPos, cursorInfo.yPos]);
    }, [cursorInfo]);

    useEffect(() => {
        if (
            canvasRef.current &&
            wordNodes &&
            Object.keys(wordNodes).length > 0
        ) {
            setWordNodes(
                zoomNodes(
                    zoomFactor,
                    [cursorInfo.xPos, cursorInfo.yPos],
                    canvasRef.current.width,
                    wordNodes
                )
            );
        }
    }, [zoomFactor]);

    return (
        <Box
            className="canvasBox"
            display="flex"
            flexDirection="column"
            flexGrow={1}
        >
            <Box
                flex={1}
                sx={{ border: "1px solid lightgrey", borderRadius: "5px" }}
            >
                <Backdrop open={loading}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                <canvas
                    style={{ borderRadius: "5px" }}
                    ref={canvasRef}
                    onMouseMove={handleMouseMove}
                    onMouseDown={(e) => {
                        handleMouseClick(e);
                    }}
                    onMouseUp={(e) => {
                        handleMouseUnclick(e);
                        isCanvasClicked &&
                            centerCursorButtonInfo.isHovered &&
                            handleCursorCenter();
                    }}
                    onMouseLeave={(e) => {
                        handleMouseUnclick(e);
                    }}
                    onMouseOut={(e) => {
                        handleMouseUnclick(e);
                    }}
                    onWheel={handleZoom}
                />
                <Box
                    className="CenterButtonTooltipHandler"
                    sx={{
                        p: 0,
                        float: "right",
                        mt: `${-centerCursorButtonInfo.h - 33}px`, //have to figure out where that 38 comes from...
                        mr: "50px",
                        height: centerCursorButtonInfo.h,
                        width: centerCursorButtonInfo.w,
                        // border: "1px solid yellow", //will be used to display a tooltip whenever I manage to make this work...
                    }}
                ></Box>
            </Box>
        </Box>
    );
}
