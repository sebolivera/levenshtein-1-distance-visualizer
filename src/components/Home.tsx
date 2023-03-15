import { Box, TextField, Typography, Slider, Input } from "@mui/material";
import { useState, ChangeEvent } from "react";
import Canvas from "./Canvas";

export default function Home() {
    const [word, setWord] = useState<string>("art");
    const [radius, setRadius] = useState<number>(25);
    const [repeats, setRepeats] = useState<number>(2);//limited to 3 max, as the retrieval algorithm is *REALLY* slow and unoptimized at the moment.

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
                <TextField
                    type="text"
                    placeholder="Type a word (ex: art)"
                    value={word}
                    onChange={handleWord}
                    label="Input Word"
                />
                <Box pl={2}>
                    <Typography sx={{ paddingBottom: 1 }} id="nodeSize-label">
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
                <Box pl={2}>
                    <Typography sx={{ paddingBottom: 1 }} id="distance-label">
                        Number of Repeats
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
