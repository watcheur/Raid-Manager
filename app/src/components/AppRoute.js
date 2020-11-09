import React, { Component } from "react";
import { Redirect, Route } from "react-router-dom";

import { useAuthState } from "../context";

const AppRoute = ({ component: Component, path, isPrivate, ...rest }) => {
    const userDetails = useAuthState();

    return (
        <Route
            path={path}
            render={props => isPrivate && !userDetails.user ? ( <Redirect to='/login' /> ) : ( <Component {...props} /> )}
            {...rest}
        />
    )
}

export default AppRoute;