import React from 'react';
import {BrowserRouter, Route, Switch} from "react-router-dom";

import Warning from "./screens/Warning";

import Navbar from './components/Nav';
import Routes from "./routing/Routes";

function App() {

  return (
      <BrowserRouter>
        <Navbar />
        <main>
          <Switch>
            <Route path="/warning" exact component={ Warning } />
            <Route exact component={ Routes } />

            {/*<Route path='/' exact component={ DashboardScreen } />*/}
            {/*<Route path="/login" exact component={ LoginScreen } />*/}
            {/*<Route path="/register" exact component={ RegisterScreen } />*/}
            {/*<Route path="/room/:roomId" component={ RoomScreen } />*/}
          </Switch>
        </main>

      </BrowserRouter>

  );
}

export default App;
