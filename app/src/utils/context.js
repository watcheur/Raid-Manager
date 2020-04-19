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

String.prototype.slugify = function(separator) {
    let text = this.toLowerCase().trim();

    const sets = [
        {to: 'a', from: '[ÀÁÂÃÄÅÆĀĂĄẠẢẤẦẨẪẬẮẰẲẴẶ]'},
        {to: 'c', from: '[ÇĆĈČ]'},
        {to: 'd', from: '[ÐĎĐÞ]'},
        {to: 'e', from: '[ÈÉÊËĒĔĖĘĚẸẺẼẾỀỂỄỆ]'},
        {to: 'g', from: '[ĜĞĢǴ]'},
        {to: 'h', from: '[ĤḦ]'},
        {to: 'i', from: '[ÌÍÎÏĨĪĮİỈỊ]'},
        {to: 'j', from: '[Ĵ]'},
        {to: 'ij', from: '[Ĳ]'},
        {to: 'k', from: '[Ķ]'},
        {to: 'l', from: '[ĹĻĽŁ]'},
        {to: 'm', from: '[Ḿ]'},
        {to: 'n', from: '[ÑŃŅŇ]'},
        {to: 'o', from: '[ÒÓÔÕÖØŌŎŐỌỎỐỒỔỖỘỚỜỞỠỢǪǬƠ]'},
        {to: 'oe', from: '[Œ]'},
        {to: 'p', from: '[ṕ]'},
        {to: 'r', from: '[ŔŖŘ]'},
        {to: 's', from: '[ßŚŜŞŠ]'},
        {to: 't', from: '[ŢŤ]'},
        {to: 'u', from: '[ÙÚÛÜŨŪŬŮŰŲỤỦỨỪỬỮỰƯ]'},
        {to: 'w', from: '[ẂŴẀẄ]'},
        {to: 'x', from: '[ẍ]'},
        {to: 'y', from: '[ÝŶŸỲỴỶỸ]'},
        {to: 'z', from: '[ŹŻŽ]'},
        {to: '-', from: '[·/_,:;\']'}
    ];

    sets.forEach(set => {
        text = text.replace(new RegExp(set.from,'gi'), set.to);
    });

    text = text.toString().toLowerCase()
        .replace(/\s+/g, '-')         // Replace spaces with -
        .replace(/&/g, '-and-')       // Replace & with 'and'
        .replace(/[^\w\-]+/g, '')     // Remove all non-word chars
        .replace(/\--+/g, '-')        // Replace multiple - with single -
        .replace(/^-+/, '')           // Trim - from start of text
        .replace(/-+$/, '');          // Trim - from end of text

    if ((typeof separator !== 'undefined') && (separator !== '-')) {
        text = text.replace(/-/g, separator);
    }

    return text;
}



export default new Context()