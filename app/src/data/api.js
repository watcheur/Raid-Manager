import axios from 'axios';

class Api {
    constructor() {
        this.axios = axios.create();
        this.endpoint = "http://localhost:3005";
    }

    Get = (endpoint, args) => {
        return this.axios.get(`${this.endpoint}${endpoint}`, {
            headers: {
                'Accept': 'application/json'
            },
            params: {
                ...args
            }
        });
    }

    Delete = (endpoint, args) => {
        return this.axios.delete(`${this.endpoint}${endpoint}`, {
            headers: {
                'Accept': 'application/json'
            },
            params: {
                ...args
            }
        });
    }

    Post = (endpoint, data, args) => {
        console.log("data", data);
        return this.axios.post(`${this.endpoint}${endpoint}`, {...data }, {
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
        return this.axios.put(`${this.endpoint}${endpoint}`, {...data }, {
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
    RefreshCharacter = (id) => this.Get(`/characters/${id}/refresh`);
    CreateCharacter = (data) => this.Post('/characters', data);
    UpdateCharacter = (id, data) => this.Put(`/characters/${id}`, data);
    DeleteCharacter = (id) => this.Delete(`/characters/${id}`);

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
    DeleteEvent = (id) => this.Delete(`/events/${id}`);

    GetComp = (event) => this.Get(`/compositions/${event}`);
    GetCompEncounter = (event, encounter) => this.Get(`/compositions/${event}/${encounter}`);
    CreateComp = (data) => this.Post(`/compositions`, data);

    GetOptions = () => this.Get('/options');
    CreateOptions = (data) => this.Post('/options', data);

    GetFavoritesNotes = () => this.Get('/notes/favorites');
    CreateNote = (title, text, favorite) => this.Post('/notes', { title: title, text: text, favorite: favorite });
    UpdateNote = (id, title, text, favorite) => this.Put(`/notes/${id}`, { title: title, text: text, favorite: favorite });
    DeleteNote = (id) => this.Delete(`/notes/${id}`);

    GetRealms = (args) => this.Get('/blizzard/realms', args);

    GetAverageIlvl = () => this.Get('/stats/ilvl');
    GetAverageAzerite = () => this.Get('/stats/azerite');
    GetWeeklyRuns = () => this.Get('/stats/weekly');
}

export default new Api()