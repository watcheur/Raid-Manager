import axios from 'axios';

class Api {
    constructor() {
        this.axios = axios.create();
        this.endpoint = "http://localhost:3005";
    }

    Get = (endpoint, args) => {
        return this.axios.get(`${this.endpoint}/${endpoint}`, {
            headers: {
                'Accept': 'application/json'
            },
            params: {
                ...args
            }
        });
    }

    Delete = (endpoint, args) => {
        return this.axios.delete(`${this.endpoint}/${endpoint}`, {
            headers: {
                'Accept': 'application/json'
            },
            params: {
                ...args
            }
        });
    }

    Post = (endpoint, data, args) => {
        return this.axios.post(`${this.endpoint}/${endpoint}`, {...data }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            params: {
                ...args
            }
        });
    }

    Put = (endpoint, data, args) => {
        return this.axios.put(`${this.endpoint}/${endpoint}`, {...data }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            params: {
                ...args
            }
        });
    }

    GetCharacters = (args) => this.Get('/characters', args);
    GetCharacter = (id) => this.Get(`/characters/${id}`);
    CreateCharacter = (data) => this.Post('/characters', data);
    UpdateCharacter = (id, data) => this.Put(`/characters/${id}`, data);
    DeleteCharacter = (id) => this.Delete(`/characters/${id}`, data);

    GetRaids = (args) => this.Get('/raids', args);
    GetRaid = (id) => this.Get(`/raids/${id}`);
    GetRaidEncounters = (id) => this.Get(`/raids/${id}/encounters`);

    GetExpansions = () => this.Get('/expansions');
    GetCurrentExpansion = () => this.Get('/expansions/current');
    RefreshExpansions = () => this.Get('/expansions/refresh');

    GetEvents = (args) => this.Get('/events', args);
    GetEvent = (id) => this.Get(`/events/${id}`);
    CreateEvent = (data) => this.Post('/events', data);
    UpdateEvent = (id, data) => this.Put(`/events/${id}`, data);

    LoadComp = (event) => this.Get(`/compositions/${event}`);
    CreateComp = (event, data) => this.Post(`/compositions/${event}`, data);
}

export default new Api()