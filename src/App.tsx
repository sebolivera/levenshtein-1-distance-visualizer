import "./App.css";
import { Box } from "@mui/material";
import CustomAppBar from "./components/CustomAppBar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import { Theme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import FourOFour from "./components/FourOFour";
import { useState, useContext } from "react";
import CustomTheme, { darkTheme, lightTheme } from "./config/Theme";

function App() {

    const [theme, setTheme] = useState<Theme>(useContext<Theme>(CustomTheme));
    const handleTheme = () => {
        if (theme.palette.mode === "light") {
            setTheme(darkTheme);
        } else {
            setTheme(lightTheme);
        }
    };


    return (
        <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme>
                <Box
                    className="appBox"
                    height="100%"
                    display="flex"
                    flexDirection="column"
                >
                    <BrowserRouter>
                        <CustomAppBar handleTheme={handleTheme}/>
                        <Routes>
                            <Route path="/" element={<Home />}></Route>
                            <Route path="/*" element={<FourOFour />}></Route>
                        </Routes>
                    </BrowserRouter>
                </Box>
            </CssBaseline>
        </ThemeProvider>
    );
}

export default App;
