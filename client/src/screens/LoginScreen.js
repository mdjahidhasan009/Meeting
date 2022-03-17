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
                M.toast({html: 'Login Successful', classes: 'green'});
                history.push("/");
            })
            .catch((err) => {
                console.log(err)
                if(err && err.response) M.toast({ html: 'Error:' + err.toString(), classes:'red'});
                if(err && err.response && err.response.data)
                    M.toast({ html: 'Error:' + err.response.data.message.toString() + "88\n", classes:'red'});
                M.toast({ html: 'Error:' + err.toString(), classes:'red'});
                if(err.response && err.response.data) console.log(err.response.data.message);
                M.toast({html: err?.response?.data?.message, classes: 'red'});
            });
    };

    return (
        <div className="card">
            <div className="cardHeader">Login</div>
            <form className="cardBody" onSubmit={loginUser}>
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
                <button>Login</button>
                <button onClick={() => history.push('/register')}>Create A New Account</button>
            </form>
        </div>
    );
};

export default LoginScreen;
