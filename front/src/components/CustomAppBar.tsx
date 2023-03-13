import {
    AppBar,
    Typography,
    Box,
    Toolbar,
    Button,
    IconButton,
} from "@mui/material";

import MenuIcon from '@mui/icons-material/Menu';

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
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        App bar or smth
                    </Typography>
                    <Button color="inherit" sx={{fontWeight: 600}}>Login</Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
