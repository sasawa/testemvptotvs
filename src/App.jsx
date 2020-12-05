import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Login from "./login/Login.jsx";
import Painel from "./painel/Painel.jsx";

const App = () => {
  
  return (
    <Router>
        <Switch>
          <Route path="/painel">
            <Painel />
          </Route>
          <Route path="/">
            <Login />
          </Route>
        </Switch>
    </Router>
  );
}

export default App;