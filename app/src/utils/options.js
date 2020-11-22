import Api from '../data/api'
import { Dispatcher, Constants } from "../flux";

import { registerLocale, setDefaultLocale } from  "react-datepicker";
import fr from 'date-fns/locale/fr';
import gb from 'date-fns/locale/en-GB';
import us from 'date-fns/locale/en-US';

registerLocale('fr_FR', fr);
registerLocale('en_GB', gb);
registerLocale('en_US', us);

class Options {
    artifact_ilvl = 300;
    legendary_ilvl = 226;
    epic_ilvl = 210;
    rare_ilvl = 200;
    uncommon_ilvl = 184;
    common_ilvl = 150;
    poor_ilvl = 0;

    constructor() {
        this.LoadData();
    }

    async LoadData() {
        try {
            const optResponse = await Api.GetOptions();
            if (optResponse.data.err) {
                optResponse.data.data.forEach(opt => this.Options[opt.key] = opt.value );

                Dispatcher.dispatch({
                    actionType: Constants.OPTIONS_LOADED
                });
            }
        }
        catch (err) {}
    }
}

export default new Options()