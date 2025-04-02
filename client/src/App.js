import React from "react";
import { StateProvider } from "./Context/usecontext";
import { SocketProvider } from "./Context/SocketContetx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage";
import Maineditor from "./components/Maineditor";
import LiveEditor from "./components/LiveEditor"
import "./App.css";
import AuthForm from "./components/AuthForm ";
import Check from "./components/Check";

function App() {
  return (
    <SocketProvider>

    <StateProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/ghgf" element={<Check />} />
            <Route path="/editor/:id" element={<Maineditor />} />
            <Route path="/Authorization" element={<AuthForm/>} />
            <Route path="/edit/p/:userid/:programid" element={<LiveEditor/>} />
          </Routes>
        </div>
      </Router>
    </StateProvider>
    </SocketProvider>
  );
}

export default App;
