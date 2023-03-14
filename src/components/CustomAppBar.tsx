import {
    AppBar,
    Typography,
    Box,
    Toolbar,
    Button,
    IconButton,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import { Link } from "react-router-dom";

export default function CustomAppBar() {
    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
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
                            <HomeIcon />
                        </Link>
                    </IconButton>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        Levenshtein-1 distance graph visualizer
                    </Typography>
                    <Button color="inherit" sx={{ fontWeight: 600 }}>
                        Login
                    </Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
