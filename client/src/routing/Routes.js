import React, { Fragment } from 'react';
import { Switch } from "react-router-dom";

import PCRoute from "./PCRoute";
import DashboardScreen from "../screens/DashboardScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import RoomScreen from "../screens/RoomScreen/RoomScreen";

const Routes = () => {
  return (
      <Fragment>
        <Switch>
          <PCRoute path='/' exact component={ DashboardScreen } />
          <PCRoute path="/login" exact component={ LoginScreen } />
          <PCRoute path="/register" exact component={ RegisterScreen } />
          <PCRoute path="/room/:roomId" component={ RoomScreen } />
        </Switch>
      </Fragment>
  )
}

export default Routes;
