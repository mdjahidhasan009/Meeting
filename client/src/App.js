import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import DashboardScreen from "./screens/DashboardScreen";
import RoomScreen from "./screens/RoomScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={DashboardScreen} />
        <Route path="/login" exact component={LoginScreen} />
        <Route path="/register" exact component={RegisterScreen} />
        <Route path="/room/:roomId" component={RoomScreen} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
