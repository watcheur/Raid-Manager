import { Dispatcher } from "flux";
import SocketIOClient from "socket.io-client";

import Api from '../data/api';
import Constants from "./constants";

const dispatcher = new Dispatcher();

const socket = SocketIOClient(Api.endpoint, {path:'/raidmanager/socket.io'});

socket.on(Constants.CHANNEL_CHARACTER, data => {
    dispatcher.dispatch({
        actionType: data.action,
        ...data.data
    })
});

socket.on(Constants.CHANNEL_EVENT, data => {
    dispatcher.dispatch({
        actionType: data.action,
        ...data.data
    })
});

socket.on(Constants.CHANNEL_COMP, data => {
    dispatcher.dispatch({
        actionType: data.action,
        ...data.data
    })
});

socket.on(Constants.CHANNEL_NOTE, data => {
    dispatcher.dispatch({
        actionType: data.action,
        ...data.data
    })
});

export default dispatcher;
