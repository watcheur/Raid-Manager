import Api from '../data/api'

class Context {
    Options = {
        legendary_ilvl: 475,
        epic_ilvl: 470,
        rare_ilvl: 460,
        uncommon_ilvl: 430,
        poor_ilvl: 0
    }

    constructor() {
        Api.GetOptions().then(res => {
            if (!res.data.err)
                res.data.data.forEach(opt => this.Options[opt.key] = opt.value );
        })
    }

    GetOpt = (key) => {
        return this.Options.find(opt => opt.key = key)
    }
}



export default new Context()