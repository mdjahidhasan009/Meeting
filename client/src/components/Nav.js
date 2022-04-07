import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import M from "materialize-css";

import useAuthenticated from "../hooks/useAuthentication";
import './Navbar.css';

const Navbar = () => {
  let isAuthenticated = useAuthenticated();

  useEffect(() => {
    document.addEventListener('DOMContentLoaded', function() {
      let elems = document.querySelectorAll('.sidenav');
      M.Sidenav.init(elems);
    });
  }, []);

  return (
     <>
       <nav className="nav-extended">
         <div className="nav-wrapper">
           <Link to="#" className="brand-logo">Meeting</Link>
           <Link to="#" data-target="mobile-demo" className="sidenav-trigger">
             <i className="fa fa-bars" aria-hidden="true" />
           </Link>
           <ul id="nav-mobile" className="right hide-on-med-and-down">
             {isAuthenticated ? (
                 <li><Link to="/">Dashboard</Link></li>
               ) : (
                 <>
                   <li><Link to="/login">Login</Link></li>
                   <li><Link to="/register">Register</Link></li>
                 </>
             )}
           </ul>
         </div>
       </nav>

       <ul className="sidenav" id="mobile-demo">
         {isAuthenticated ? (
             <li><Link to="/">Dashboard</Link></li>
         ) : (
             <>
               <li><Link to="/login">Login</Link></li>
               <li><Link to="/register">Register</Link></li>
             </>
         )}
       </ul>
     </>
  )
}

export default Navbar;
