import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Auth/login";
import Signup from "./Auth/Signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" />
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;