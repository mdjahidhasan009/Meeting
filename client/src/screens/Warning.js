import React from "react";
import axios from "axios";
import M from 'materialize-css';
import { useHistory } from 'react-router-dom';

const Warning = (props) => {
    const emailRef = React.createRef();
    const passwordRef = React.createRef();
    const history = useHistory();

    return (
        <div className="card">
            <div className="card__header">Warning</div>
            <div className="card__body">
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis consequuntur culpa dolore dolorem dolorum, error est, excepturi explicabo id ipsa natus necessitatibus non officiis perspiciatis sequi temporibus unde veritatis, vero.</p>
            </div>
        </div>
    );
};

export default Warning;
