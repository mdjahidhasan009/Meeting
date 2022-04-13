import React, { useEffect } from "react";
import { v1 as uuid } from "uuid";
import useAuthentication from "../hooks/useAuthentication";

import M from 'materialize-css';

const DashboardScreen = (props) => {
    let isAuthenticated = useAuthentication();
    const createRoom = () => {
        const id = uuid();
        props.history.push(`/room/${id}`);
    };

    useEffect(() => {
        if(!isAuthenticated) {
            M.toast({ html: 'Login first', classes:'red' });
            props.history.push('/login');
        }
        //eslint-disable-next-line
    }, [isAuthenticated]);

    const logout = () => {
        localStorage.removeItem("Token");
        props.history.push('/login');
    }

    return (
        <div className="container">
            <div className="card-container">
                <div className="card">
                    <div className="card__header">Note</div>
                    <div className="card__body">
                        <p>In this project I am using free stun and turn servers. As turn server transfer media(video) it is expensive that's why free turn server sometime can not transfer media with two client in different network. <b>But it works(video transmission) in same network(router)</b>. And chat message works always without any issue.</p>
                    </div>
                </div>
                <div className="card">
                    <button onClick={createRoom}>Create room</button>
                    <button onClick={logout}>Logout</button>
                </div>
            </div>
        </div>
    );
};

export default DashboardScreen;
