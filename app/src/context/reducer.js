import React, { useReducer } from "react";

let user = "";
let team = "";

const storageUser = localStorage.getItem('user');
const storageTeam = localStorage.getItem('team');

if (storageUser)
    user = JSON.parse(storageUser) || "";
if (storageTeam)
    team = JSON.parse(storageTeam) || "";

export const initialState = {
    user: user || "",
    team: team || "",
    loading: false,
    errorMessage: null
}

export const AuthReducer = (initialState, action) => {
    switch (action.type) {
        case "REQUEST_LOGIN":
            return {
                ...initialState,
                loading: true
            };
        case "LOGIN_SUCCESS":
            return {
                ...initialState,
                user: action.payload.user,
                loading: false
            };
        case "LOGOUT":
            return {
                ...initialState,
                user: "",
                team: ""
            };
        case "LOGIN_ERROR":
            return {
                ...initialState,
                loading: false,
                errorMessage: action.error
            };
        case "TEAM_SELECT":
            return {
                ...initialState,
                team: action.payload.team
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
};