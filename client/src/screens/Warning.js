import React from "react";
import axios from "axios";
import M from 'materialize-css';
import { useHistory } from 'react-router-dom';

const Warning = (props) => {

    return (
        <div className="container">
          <div className="card">
            <div className="card-container">
              <div className="card__header">Warning</div>
              <div className="card__body">
                <p>This site only for PC device only!</p>
              </div>
            </div>
          </div>
        </div>
    );
};

export default Warning;
