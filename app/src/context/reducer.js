import React, { useReducer } from "react";
import SocketIOClient from "socket.io-client";
import url from 'url';
import Dispatcher from '../flux/dispatcher';

import Api from '../data/api';
import Constants from "../flux/constants";

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

const endpoint = url.parse(Api.endpoint);
const socket = SocketIOClient(`${endpoint.protocol}//${endpoint.host}`);

socket.on('connect', () => {
    if (team)
        socket.emit('team', { team: team.id });
})

socket.on(Constants.CHANNEL_CHARACTER, data => {
    console.log(Constants.CHANNEL_CHARACTER, data);
    Dispatcher.dispatch({
        channel: Constants.CHANNEL_CHARACTER,
        actionType: data.action,
        ...data.data
    })
});

socket.on(Constants.CHANNEL_EVENT, data => {
    console.log(Constants.CHANNEL_EVENT, data);
    Dispatcher.dispatch({
        channel: Constants.CHANNEL_EVENT,
        actionType: data.action,
        ...data.data
    })
});

socket.on(Constants.CHANNEL_COMP, data => {
    console.log(Constants.CHANNEL_COMP, data);
    Dispatcher.dispatch({
        channel: Constants.CHANNEL_COMP,
        actionType: data.action,
        ...data.data
    })
});

socket.on(Constants.CHANNEL_NOTE, data => {
    console.log(Constants.CHANNEL_NOTE, data);
    Dispatcher.dispatch({
        channel: Constants.CHANNEL_NOTE,
        actionType: data.action,
        ...data.data
    })
});

socket.on(Constants.CHANNEL_PLAYER, data => {
    console.log(Constants.CHANNEL_PLAYER, data);
    Dispatcher.dispatch({
        channel: Constants.CHANNEL_PLAYER,
        actionType: data.action,
        ...data.data
    })
});

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
            if (socket)
                socket.emit('team', action.payload.team.id);
            return {
                ...initialState,
                team: action.payload.team
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
};