import { Box, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { Link as LinkMUI } from "@mui/material";
export default function FourOFour() {
    const location = useLocation();
    return (
        <Box pl={5} pt={3}>
            <Typography variant="h2">
                404, page {location.pathname} not found
            </Typography>
            <LinkMUI>
                <Typography variant="h6">
                    <Link
                        to="/"
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        Go home
                    </Link>
                </Typography>
            </LinkMUI>
        </Box>
    );
}
