import { Box, TextField, Typography } from "@mui/material";
import Canvas from "./Canvas";
import { useEffect, useState, ChangeEvent } from "react";

export default function Home() {
    const [word, setWord] = useState<string>("Lego");

    const handleWord = (
        e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        setWord(e.target.value);
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
                    placeholder="Lego"
                    value={word}
                    onChange={handleWord}
                ></TextField>
            </Box>
            <Box mb={5} flexGrow={1} display="flex">
                <Canvas word={word} />
            </Box>
        </Box>
    );
}
