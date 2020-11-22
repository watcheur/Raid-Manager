import axios from 'axios';

class Api {
    constructor() {
        this.axios = axios.create();
        this.endpoint = "http://api.raid-manager.fr";

        if (process.env.NODE_ENV && process.env.NODE_ENV === 'development')
            this.endpoint = "http://localhost:3005";

        const local_endpoint = localStorage.getItem('api');
        if (local_endpoint && local_endpoint.length > 0)
            this.endpoint = local_endpoint;

        this.axios.interceptors.response.use(
            response => response,
            async error => {
                try {
                    if (!error.response)
                        return Promise.reject(error);

                    const { response } = error;

                    if (error.config.url === "/api/auth/refresh" || response.status !== 401)
                        return Promise.reject(error);
                    
                    try {
                        const res = await this.Refresh();
                        if (res)
                            return this.axios.request(error.config);
                    }
                    catch (err) {
                        console.log("err token api.refresh", err);
                    }
                }
                catch (err) {
                    console.log("err token refresh", err);
                }
                
                return Promise.reject(error);
            }
        );
    }

    Get = (endpoint, args) => {
        return this.axios.get(`/api${endpoint}`, {
            headers: {
                'Accept': 'application/json'
            },
            params: {
                ...args
            }
        });
    }

    Delete = (endpoint, args) => {
        return this.axios.delete(`/api${endpoint}`, {
            headers: {
                'Accept': 'application/json'
            },
            params: {
                ...args
            }
        });
    }

    Post = (endpoint, data, args) => {
        return this.axios.post(`/api${endpoint}`, {...data }, {
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
        return this.axios.put(`/api${endpoint}`, {...data }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            params: {
                ...args
            }
        });
    }

    GetEndpoint = () => this.endpoint;

    Login = (email, password) => this.Post('/auth/login', { email: email, password: password });
    Logout = () => this.Get('/auth/logout');
    Refresh = () => this.Get('/auth/refresh');

    GetTeams = () => this.Get('/teams');

    GetCurrentUser = () => this.Get('/users/current');

    GetPlayers = (args) => this.Get('/players', args);
    GetPlayer = (id) => this.Get(`/players/${id}`);
    CreatePlayer = (data) => this.Post('/players', data);
    UpdatePlayer = (id, data) => this.Put(`/players/${id}`, data);
    DeletePlayer = (id) => this.Delete(`/players/${id}`);

    GetCharacters = (args) => this.Get('/characters', args);
    GetCharacter = (id, args) => this.Get(`/characters/${id}`, args);
    RefreshCharacter = (id, args) => this.Get(`/tasks/character/${id}`, args);
    CreateCharacter = (data, args) => this.Post('/characters', data, args);
    UpdateCharacter = (id, data, args) => this.Put(`/characters/${id}`, data, args);
    DeleteCharacter = (id, args) => this.Delete(`/characters/${id}`, args);
    
    ToggleNeed = (character, id, difficulty, args) => this.Post(`/wishlist/toggle`, { character: character, item: id, difficulty: difficulty }, args);
    GetWishlist = (args) => this.Get('/wishlist', args);

    GetRaids = (args) => this.Get('/raids', args);
    GetRaid = (id) => this.Get(`/raids/${id}`);
    GetRaidEncounters = (id) => this.Get(`/raids/${id}/encounters`);

    GetExpansions = () => this.Get('/expansions');
    GetCurrentExpansion = () => this.Get('/expansions/current');
    RefreshExpansions = () => this.Get('/expansions/refresh');

    GetEvents = (args) => this.Get('/events', args);
    GetEvent = (id, args) => this.Get(`/events/${id}`, args);
    CreateEvent = (data, args) => this.Post('/events', data, args);
    UpdateEvent = (id, data, args) => this.Put(`/events/${id}`, data, args);
    DeleteEvent = (id, args) => this.Delete(`/events/${id}`, args);
    GetNextEvent = (args) => this.Get('/events/next', args);
    DuplicateEvent = (id, data, args) => this.Post(`/events/${id}/duplicate`, data, args);

    GetComp = (event, args) => this.Get(`/compositions/${event}`, args);
    GetCompEncounter = (event, encounter, args) => this.Get(`/compositions/${event}/${encounter}`, args);
    CreateComp = (data, args) => this.Post(`/compositions`, data, args);

    GetOptions = (args) => this.Get('/options', args);
    CreateOptions = (data, args) => this.Post('/options', data, args);

    GetFavoritesNotes = (args) => this.Get('/notes/favorites', args);
    CreateNote = (title, text, favorite, args) => this.Post('/notes', { title: title, text: text, favorite: favorite }, args);
    UpdateNote = (id, title, text, favorite, args) => this.Put(`/notes/${id}`, { title: title, text: text, favorite: favorite }, args);
    DeleteNote = (id, args) => this.Delete(`/notes/${id}`, args);

    GetRealms = (args) => this.Get('/realms', args);

    GetAverageIlvl = () => this.Get('/stats/ilvl');
    GetAverageAzerite = () => this.Get('/stats/azerite');
    GetWeeklyRuns = () => this.Get('/stats/weekly');
    GetClassesStats = (type, role) => this.Get('/stats/classes', { type: type, role: role });

    SpellMedia = (id) => `${this.endpoint}/blizzard/spell/${id}/media`;
}

export default new Api()