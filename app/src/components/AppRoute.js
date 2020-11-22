import React, { Component, useState } from "react";
import { Redirect, Route } from "react-router-dom";

import { useAuthState } from "../context";

const AppRoute = ({ component: Component, path, isPrivate, ...rest }) => {
    const userDetails = useAuthState();

    console.log("details", userDetails);

    return (
        <Route
            path={path}
            render={
                props => {
                    if (isPrivate)
                    {
                        if (!userDetails.user)
                            return <Redirect to="/login" />
                        if (userDetails.user && !userDetails.team && path != "/teams")
                            return <Redirect to="/teams" />
                    }

                    return <Component {...props} />
                }
            }
            {...rest}
        />
    )
}

export default AppRoute;