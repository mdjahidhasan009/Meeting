import React, { useEffect, useState } from 'react';
import {Redirect, Route} from "react-router-dom";

const PCRoute = ({ component: Component,  ...rest }) => {
  const [ isVisitingFromPC, setIsVisitingFromPC ] = useState(true);
  useEffect(() => {
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      setIsVisitingFromPC(false);
    }
  }, []);
  return(
    <Route
      {...rest}
      render={(props) =>  !isVisitingFromPC ?
          (
              <Redirect to="/warning"/>
          ) : (
              <Component {...props}  />
          )

      }
    />
  )
}

export default PCRoute;
