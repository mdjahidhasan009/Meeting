import React, { useEffect, useState } from 'react';
import {BrowserRouter, Route, Switch, useHistory, useParams} from "react-router-dom";
import DashboardScreen from "./screens/DashboardScreen";
import RoomScreen from "./screens/RoomScreen/RoomScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import Warning from "./screens/Warning";

import Navbar from './components/Nav';
// import M from "materialize-css";

function App() {
  // let history = useHistory();
  // let params = useParams();
  //
  // const [ isAuthenticated, setIsAuthenticated ] = useState(true);

  // useEffect(() => {
  //   //checking is user logged in or not(if user has no token means not logged in)
  //   const token = localStorage.getItem('Token');
  //   console.log("TOKEN:"+token)
  //   if(!token) {
  //     setIsAuthenticated(false);
  //     console.log("isAuthenticated=" + false)
  //   }
  //   console.log(params)
  //   //eslint-disable-next-line
  // }, [localStorage, params]);
  return (

      <BrowserRouter>
        <Navbar />
        <main>
          <Switch>
            {/*<Route path='/' exact render={(props) => <DashboardScreen {...props} isAuthenticated={isAuthenticated} />}/>*/}
            <Route path='/' exact component={ DashboardScreen } />
            {/*<Route path="/" isAuthenticated={isAuthenticated} exact components={DashboardScreen} />*/}
            <Route path="/warning" exact component={Warning} />
            <Route path="/login" exact component={LoginScreen} />
            <Route path="/register" exact component={RegisterScreen} />
            <Route path="/room/:roomId" component={RoomScreen} />
          </Switch>
        </main>

      </BrowserRouter>

  );
}

export default App;
