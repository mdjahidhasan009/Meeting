import React from "react";
import axios from "axios";
import M from 'materialize-css';
import { useHistory } from 'react-router-dom';

const LoginScreen = (props) => {
    const emailRef = React.createRef();
    const passwordRef = React.createRef();
    const history = useHistory();

    const loginUser = (e) => {
        e.preventDefault();
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        axios
            .post(process.env.REACT_APP_BASE_URL + "/user/login", {
                email,
                password,
            })
            // }, {withCredentials: true})
            .then((response) => {
                localStorage.setItem("Token", response.data);
                console.log(localStorage.getItem("Token"));
                M.toast({html: 'Login Successful', classes: 'green'});
                props.history.push("/");
            })
            .catch((err) => {
                if(err && err.response) M.toast({ html: 'Error:' + err.toString(), classes:'red'});
                else if(err && err.response && err.response.data)
                    M.toast({ html: 'Error:' + err.response.data.message.toString() + "88\n", classes:'red'});
                // M.toast({ html: 'Error:' + err.toString(), classes:'red'});
                else if(err.response && err.response.data) console.log(err.response.data.message);
                M.toast({html: err?.response?.data?.message, classes: 'red'});
            });
    };

    return (
        <div className="container">
            <div className="card-container">
                <div className="card">
                    <div className="card__header">Login</div>
                    <form className="card__body" onSubmit={loginUser}>
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
                        <button>Login</button>
                        <button onClick={() => history.push('/register')}>Create A New Account</button>
                    </form>
                </div>


            </div>
        </div>
    );
};

export default LoginScreen;
