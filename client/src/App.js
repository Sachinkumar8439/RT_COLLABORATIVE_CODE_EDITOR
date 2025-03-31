import React from "react";
import { StateProvider } from "./Context/usecontext";
import { SocketProvider } from "./Context/SocketContetx";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Homepage from "./components/Homepage";
import Maineditor from "./components/Maineditor";
import "./App.css";
import AuthForm from "./components/AuthForm ";

function App() {
  return (
    <SocketProvider>

    <StateProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/editor/:id" element={<Maineditor />} />
            <Route path="/Authorization" element={<AuthForm/>} />
          </Routes>
        </div>
      </Router>
    </StateProvider>
    </SocketProvider>
  );
}

export default App;
