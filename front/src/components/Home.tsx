import { Box, TextField, Typography, Slider } from "@mui/material";
import { useState, ChangeEvent } from "react";
import Canvas from "./Canvas";

export default function Home() {
    const [word, setWord] = useState<string>("Lego");
    const [radius, setRadius] = useState<number>(25);

    const handleWord = (
        e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        setWord(e.target.value);
    };

    const handleRadius = (e: Event, v: number | number[]) => {
        setRadius(v as number);
    };

    return (
        <Box flexGrow={1} px={5} display="flex" flexDirection="column">
            <Box display="flex" alignItems={"center"}>
                <Typography variant="h4" py={2}>
                    Canvas
                </Typography>
                <TextField
                    sx={{ paddingLeft: 2 }}
                    type="text"
                    placeholder="Any word..."
                    value={word}
                    onChange={handleWord}
                ></TextField>
                <Slider
                    aria-label="Radius"
                    value={radius}
                    min={1}
                    max={500}
                    onChange={handleRadius}
                    sx={{ marginLeft: 2, width: "300px" }}
                />
            </Box>
            <Box mb={5} flexGrow={1} display="flex">
                <Canvas word={word} radius={radius} setWord={setWord} />
            </Box>
        </Box>
    );
}
