import React from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

import M from "materialize-css";

const RegisterPage = (props) => {
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
        <>
            <div className="card">
                <div className="cardHeader">Register</div>
                <div className="cardBody">
                    <div className="inputGroup">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            placeholder="John Doe"
                            ref={nameRef}
                        />
                    </div>
                    <div className="inputGroup">
                        <label htmlFor="username">UserName</label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            placeholder="John Doe"
                            ref={usernameRef}
                        />
                    </div>
                    <div className="inputGroup">
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
                <div className="inputGroup">
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
            </div>
        </>
    );
};

export default RegisterPage;
