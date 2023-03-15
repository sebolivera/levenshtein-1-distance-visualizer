import {
    Box,
    TextField,
    Typography,
    Slider,
    Input,
    Tooltip,
    useTheme,
} from "@mui/material";
import { useState, ChangeEvent } from "react";
import Canvas from "./Canvas";

export default function Home() {
    const [word, setWord] = useState<string>("art");
    const [radius, setRadius] = useState<number>(25);
    const [repeats, setRepeats] = useState<number>(2); //limited to 3 max, as the retrieval algorithm is *REALLY* slow and unoptimized at the moment.
    const theme = useTheme();
    const handleWord = (
        e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        setWord(e.target.value);
    };

    const handleRadius = (e: Event, v: number | number[]) => {
        setRadius(v as number);
    };

    const handleRepeats = (e: ChangeEvent<HTMLInputElement>) => {
        setRepeats(
            !e.target || !e.target.value || e.target.value === ""
                ? 0
                : Number(e.target.value)
        );
    };
    return (
        <Box flexGrow={1} px={5} display="flex" flexDirection="column">
            <Box display="flex" alignItems="center" py={2}>
                <Tooltip
                    title='Candidate word for Levenshtein distance calculation. The smaller and more "common" the word, the more likely it is to have corresponding similar words.'
                    enterDelay={1000}
                    leaveDelay={100}
                >
                    <TextField
                        type="text"
                        placeholder="Type a word (ex: art)"
                        value={word}
                        onChange={handleWord}
                        label="Input Word"
                    />
                </Tooltip>
                <Tooltip
                    title={
                        <>
                            <Typography variant="body2">
                                Size of the nodes on the canvas.
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: theme.palette.text.disabled }}
                            >
                                Note: Doesn't have any impact on the information
                                itself, but it <i>will</i> cause a reload of the
                                canvas.
                            </Typography>
                        </>
                    }
                    enterDelay={1000}
                    leaveDelay={100}
                >
                    <Box pl={2}>
                        <Typography
                            sx={{ paddingBottom: 1 }}
                            id="nodeSize-label"
                        >
                            Node Size
                        </Typography>
                        <Slider
                            aria-label="Radius"
                            value={radius}
                            min={1}
                            max={500}
                            onChange={handleRadius}
                            sx={{ width: "150px" }}
                            aria-labelledby="nodeSize-label"
                        />
                    </Box>
                </Tooltip>
                <Tooltip
                    title={
                        <>
                            <Typography
                                variant="body2"
                                sx={{ fontSize: "0.75rem" }}
                            >
                                How many links outside of a single word the
                                server is going to process.
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontSize: "0.75rem",
                                    color: theme.palette.text.disabled,
                                }}
                            >
                                Note: this is currently limited to 3 as to not
                                overload the server until I come up with a
                                better algorithm.
                            </Typography>
                        </>
                    }
                    enterDelay={1000}
                    leaveDelay={100}
                >
                    <Box pl={2}>
                        <Typography
                            sx={{ paddingBottom: 1 }}
                            id="distance-label"
                        >
                            Folds
                        </Typography>
                        <Input
                            value={repeats}
                            aria-label="Repeats"
                            size="small"
                            onChange={handleRepeats}
                            inputProps={{
                                step: 1,
                                min: 1,
                                max: 3,
                                type: "number",
                                "aria-labelledby": "distance-labe",
                            }}
                        />
                    </Box>
                </Tooltip>
            </Box>
            <Box mb={5} flexGrow={1} display="flex">
                <Canvas
                    word={word}
                    radius={radius}
                    setWord={setWord}
                    repeats={repeats}
                />
            </Box>
        </Box>
    );
}
