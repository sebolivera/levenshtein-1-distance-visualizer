import { Theme, createTheme } from "@mui/material/styles";
import { Context, createContext } from "react";

export const darkTheme: Theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#08605F",
        },
        secondary: {
            main: "#B8BACF",
        },
        error: {
            main: "#BF0603",
        },
        warning: {
            main: "#F4D58D",
        },
        info: {
            main: "#A13D63",
        },
        background: {
            default: "#061A40",
        },
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                colorPrimary: {
                    backgroundColor: "#b5693f",
                },
            },
        },
    },
    typography: {
        fontFamily: [
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(","),
    },
});

export const lightTheme: Theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#08605F",
        },
        secondary: {
            main: "#B8BACF",
        },
        error: {
            main: "#BF0603",
        },
        warning: {
            main: "#F4D58D",
        },
        info: {
            main: "#A13D63",
        },
        background: {
            default: "#BFD4FC",
            paper: "#ffffff",
        },
    },
    typography: {
        fontFamily: [
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(","),
    },
});

const CustomTheme: Context<Theme> = createContext(darkTheme);
export default CustomTheme;
