import { useState } from "react";
import "./App.css";
import { Box } from "@mui/material";
import CustomAppBar from "./components/CustomAppBar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";

function App() {
    return (
        <Box className="appBox" height="100%" display="flex" flexDirection="column">
            <BrowserRouter>
                <CustomAppBar />
                <Routes>
                    <Route path="/" element={<Home />}></Route>
                </Routes>
            </BrowserRouter>
        </Box>
    );
}

export default App;
