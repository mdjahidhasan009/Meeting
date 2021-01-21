import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CreateRoom from "./routes/CreateRoom";
import Room from "./routes/Room";
import LoginPage from "./routes/LoginPage";
import RegisterPage from "./routes/RegisterPage";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={CreateRoom} />
        <Route path="/login" exact component={LoginPage} />
        <Route path="/register" exact component={RegisterPage} />
        <Route path="/room/:roomId" component={Room} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
