import React from "react";
import axios from "axios";
import M from 'materialize-css';

const LoginPage = (props) => {
    const emailRef = React.createRef();
    const passwordRef = React.createRef();

    const loginUser = () => {
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        // M.toast({ html: 'Email:' + email, classes:'red'});
        // M.toast({ html: 'Password:' + password, classes:'red'});

        axios
            .post(process.env.REACT_APP_BASE_URL + "/user/login", {
                email,
                password,
            })
            // }, {withCredentials: true})
            .then((response) => {
                // M.toast({ html: 'Token:' + "eeeee", classes:'red'});
                M.toast({ html: 'Token:' + response.data, classes:'red'});
                localStorage.setItem("Token", response.data);
                M.toast({html: 'Login Successful', classes: 'green'});
                props.history.push("/");
            })
            .catch((err) => {
                console.log(err)
                if(err && err.response) M.toast({ html: 'Error:' + err.toString(), classes:'red'});
                if(err && err.response && err.response.data)
                    M.toast({ html: 'Error:' + err.response.data.message.toString() + "88\n", classes:'red'});
                M.toast({ html: '11Error:' + err.toString(), classes:'red'});
                if(err.response && err.response.data) console.log(err.response.data.message);
                M.toast({html: err?.response?.data?.message, classes: 'red'});
            });
    };

    return (
        <div className="card">
            <div className="cardHeader">Login</div>
            <div className="cardBody">
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
                <button onClick={loginUser}>Login</button>
            </div>
        </div>
    );
};

export default LoginPage;
