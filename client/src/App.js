import React, {useContext} from "react";
import { StateContext } from "./Context/usecontext";
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
import Notice  from "./components/Notice"

function App() {
  const {token} = useContext(StateContext)
  
  return (
    <SocketProvider>
        <Router>
          <div className="App">
            <Routes>
            <Route path="/" element={ !token ? <Homepage /> : <Navigate to={`/editor/${token}`} />} />
            <Route path="/notice" element={!token ?<Notice/>: <Navigate to ="/"/>} />
              <Route path="/editor/:id" element={token ? <Maineditor />: <Navigate to='/' />}/>
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
    </SocketProvider>
  );
}

export default App;
