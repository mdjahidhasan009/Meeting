import React from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

import M from "materialize-css";

const RegisterScreen = (props) => {
    const nameRef = React.createRef();
    const usernameRef = React.createRef();
    const emailRef = React.createRef();
    const passwordRef = React.createRef();
    const history = useHistory();

    const registerUser = (props) => {
        const name = nameRef.current.value;
        const username = usernameRef.current.value;
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        axios
            .post(process.env.REACT_APP_BASE_URL + "/user/register", {
                name,
                username,
                email,
                password,
            })
            .then((response) => {
                M.toast({html: 'User created, Login first!', classes: 'green'});
                history.push("/login");
            })
            .catch((err) => {
                console.log(err)
                if(err.response && err.response.data) console.log(err.response.data.message);
                M.toast({html: err.response.data.message, classes: 'red'});
            });
    };

    return (
        <div className="container">
            <div className="card-container">
                <div className="card">
                    <div className="card__header">Register</div>
                    <div className="card__body">
                        <div className="input-group">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="John Doe"
                                ref={nameRef}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="username">UserName</label>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                placeholder="John Doe"
                                ref={usernameRef}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="abc@example.com"
                                ref={emailRef}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Your Password"
                            ref={passwordRef}
                        />
                    </div>
                    <button onClick={registerUser}>Register</button>
                    <button onClick={() => history.push('/login')}>Login</button>
                </div>

            </div>
        </div>
    );
};

export default RegisterScreen;
