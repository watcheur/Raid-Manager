import Api from '../data/api'
import { Dispatcher, Constants } from "../flux";

import { registerLocale, setDefaultLocale } from  "react-datepicker";
import fr from 'date-fns/locale/fr';
import gb from 'date-fns/locale/en-GB';
import us from 'date-fns/locale/en-US';

registerLocale('fr_FR', fr);
registerLocale('en_GB', gb);
registerLocale('en_US', us);

class Context {
    Options = {
        artifact_ilvl: 500,
        legendary_ilvl: 475,
        epic_ilvl: 470,
        rare_ilvl: 460,
        uncommon_ilvl: 430,
        common_ilvl: 400,
        poor_ilvl: 0
    }

    constructor() {
        Api.GetOptions().then(res => {
            if (!res.data.err) {
                res.data.data.forEach(opt => this.Options[opt.key] = opt.value );

                Dispatcher.dispatch({
                    actionType: Constants.OPTIONS_LOADED
                });
            }
        })
    }
}

export default new Context()