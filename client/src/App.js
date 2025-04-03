import React, { useEffect, useState } from "react";
import { StateProvider } from "./Context/usecontext";
import { SocketProvider } from "./Context/SocketContetx";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Homepage from "./components/Homepage";
import Maineditor from "./components/Maineditor";
import LiveEditor from "./components/LiveEditor";
import "./App.css";
import AuthForm from "./components/AuthForm ";
import Check from "./components/Check";

function App() {
  const token = localStorage.getItem("token") || null;

  return (
    <SocketProvider>
      <StateProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/ghgf" element={<Check />} />
              <Route path="/editor/:id" element={<Maineditor />} />
              <Route
                path="/Authorization"
                element={token === null ? <AuthForm /> : <Navigate to="/" />}
              />
              <Route
                path="/edit/p/:userid/:programid"
                element={<LiveEditor />}
              />
              <Route path="*" element={ <Navigate to ="/"/>} />
            </Routes>
          </div>
        </Router>
      </StateProvider>
    </SocketProvider>
  );
}

export default App;
