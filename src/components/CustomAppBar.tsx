import {
    AppBar,
    Typography,
    Box,
    Toolbar,
    Button,
    Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import HomeIcon from "@mui/icons-material/Home";
import { Link } from "react-router-dom";
import { useState } from "react";
import MUISwitch from "./MUISwitch";

export default function CustomAppBar(props: { handleTheme: () => void }) {
    const theme = useTheme();
    const [checked, setChecked] = useState<boolean>(true);
    const handleTheme = () => {
        setChecked(!checked);
        props.handleTheme();
    };
    return (
        <Box>
            <AppBar position="static">
                <Toolbar
                    sx={{
                        pl: 0,
                        ml: 0,
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                    disableGutters
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "stretch",
                        }}
                    >
                        <Tooltip
                            title="Go home"
                            enterDelay={1000}
                            leaveDelay={100}
                        >
                            <Link
                                to="/"
                                style={{
                                    textDecoration: "none",
                                    color: "inherit",
                                    padding: 0,
                                    margin: 0,
                                }}
                            >
                                <Button
                                    className="homeBtn"
                                    sx={{
                                        color: "white",
                                        p: 0,
                                        m: 0,
                                        height: "100%",
                                    }}
                                >
                                    <HomeIcon
                                        fontSize="medium"
                                        sx={{ verticalAlign: "middle" }}
                                    />
                                </Button>
                            </Link>
                        </Tooltip>
                        <Tooltip
                            title="Levenshtein Distance Visualizer"
                            enterDelay={1000}
                            leaveDelay={100}
                        >
                            <Typography
                                variant="h3"
                                sx={{ userSelect: "none" }}
                                aria-describedby="what"
                            >
                                LDV
                            </Typography>
                        </Tooltip>
                    </Box>
                    <Tooltip
                        title={`Toggle ${theme.palette.mode === "dark"?"light":"dark"}mode`}// Fun fact: this doesn't update if I use concatenated strings. Why? Fuck if I know.
                        enterDelay={500}
                        leaveDelay={50}
                    >
                        <MUISwitch onChange={handleTheme} checked={checked} />
                    </Tooltip>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
