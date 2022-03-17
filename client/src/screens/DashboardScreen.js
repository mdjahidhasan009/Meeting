import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { v1 as uuid } from "uuid";

import M from 'materialize-css';

const DashboardScreen = (props) => {
    let history = useHistory();

    const create = () => {
        const id = uuid();
        props.history.push(`/room/${id}`);
    };

    useEffect(() => {
        const token = localStorage.getItem('Token');
        if(!token) {
            M.toast({ html: 'Login first', classes:'red'});
            history.push('/login');
        }
        //eslint-disable-next-line
    }, []);

    const logout = () => {
        localStorage.removeItem("Token");
        history.push('/login');
    }

    return (
        <>
            <div className="card">
                <button onClick={create}>Create room</button>
                <button onClick={logout}>Logout</button>
            </div>
        </>
    );
};

export default DashboardScreen;
