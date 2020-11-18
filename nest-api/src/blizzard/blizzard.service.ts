import { HttpService, Injectable, Logger } from '@nestjs/common';
import { pick, merge } from "lodash";
import { map } from 'rxjs/operators';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { connect } from 'http2';

export const BlizzardEndpoints = {
    us: {
        hostname: 'https://us.api.blizzard.com',
        defaultLocale: 'en_US',
        locales: ['en_US', 'es_MX', 'pt_BR', 'multi'],
    },
    eu: {
        hostname: 'https://eu.api.blizzard.com',
        defaultLocale: 'en_GB',
        locales: ['en_GB', 'es_ES', 'fr_FR', 'ru_RU', 'de_DE', 'pt_PT', 'it_IT', 'multi'],
    },
    sea: {
        hostname: 'https://sea.api.blizzard.com',
        defaultLocale: 'en_US',
        locales: ['en_US', 'multi'],
    },
    kr: {
        hostname: 'https://kr.api.blizzard.com',
        defaultLocale: 'ko_KR',
        locales: ['ko_KR', 'en_GB', 'en_US', 'multi'],
    },
    tw: {
        hostname: 'https://tw.api.blizzard.com',
        defaultLocale: 'zh_TW',
        locales: ['zh_TW', 'en_GB', 'en_US', 'multi'],
    },
    cn: {
        hostname: 'https://gateway.battlenet.com.cn',
        defaultLocale: 'zh_CN',
        locales: ['zh_CN', 'en_GB', 'en_US', 'multi'],
    },
}

export interface BlizzardConfig {
    key: string;
    secret: string;
    origin: string;
    locale: string;
    token: string;
}

export interface IDefaultEndpoint {
    origin: string;
    hostname: string;
    defaultLocale: string;
    locales: string[];
}

export interface IEndpoint {
    origin: string;
    hostname: string;
    locale: string;
}

@Injectable()
export class BlizzardService {
    private readonly logger = new Logger(BlizzardService.name, true);

    constructor(
        private readonly http: HttpService,
        private readonly configService: ConfigService
    )
    {
        this.defaults = {
            key: this.configService.get('BLIZZARD_KEY', ""),
            secret: this.configService.get('BLIZZARD_SECRET', ""),
            origin: this.configService.get('BLIZZARD_ORIGIN', ""),
            locale: this.configService.get('BLIZZARD_LOCALE', ""),
            token: ""
        };

        this.version = "0.0.1";
    }

    private defaults : BlizzardConfig;
    private version: string;

    protected getPathHostName(origin: string, path: string)
    {
        const pathOverride = {
            '/oauth/userinfo': `https://${origin}.battle.net`,
        }

        return Object.prototype.hasOwnProperty.call(pathOverride, path) ? pathOverride[path] : BlizzardEndpoints[origin].hostname;
    }

    protected getEndpoint(origin: string, locale: string, path: string) : IEndpoint
    {
        const validOrigin: string = Object.prototype.hasOwnProperty.call(BlizzardEndpoints, origin) ? origin : 'us';
        const endpoint: IDefaultEndpoint = BlizzardEndpoints[validOrigin];

        return {
            origin: validOrigin,
            hostname: origin === 'cn' ? endpoint.hostname : this.getPathHostName(validOrigin, path),
            locale: endpoint.locales.find(item => item === locale) || endpoint.defaultLocale
        }
    }

    /**
     * Perform a single request to the Blizzard API.
     *
     * @param {String} path The pathname of the API resource
     * @param {Object} [args] API request parameters
     * @param {String} [args.origin] The region key
     * @param {String} [args.locale] A locale code for this region
     * @return {Promise} A thenable Promises/A+ reference
    */
    public async Get(path: string, args)
    {
        let { origin, locale, token, params, namespace } = pick(merge({}, this.defaults, args), [ 'origin', 'locale', 'token', 'params', 'namespace' ]);
        const endpoint = this.getEndpoint(origin, locale, path);

        if (!token)
            token = (await this.GetApplicationToken({}))?.access_token;
        
        params = {
            ...params,
            locale: endpoint.locale,
            ...(namespace ? { namespace: `${namespace}-${origin}` } : {}),
            access_token: token
        };

        //this.logger.log(`Calling ${endpoint.hostname}${encodeURI(path)} with params ${JSON.stringify(params)}`)

        return this.http.get(`${endpoint.hostname}${encodeURI(path)}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'User-Agent': `Node.js/${process.versions.node} RaidManager.js/${this.version}`
            },
            params: params
        }).pipe(map(response => response.data)).toPromise()
    }

    /**
     * Fetch an application access token.
     *
     * @param {Object} [args]
     * @param {String} [args.key] The application client ID
     * @param {String} [args.secret] The application client secret
     * @return {Promise} A thenable Promises/A+ reference
    */
    public async GetApplicationToken(args)
    {
        const { origin, key, secret } = pick(merge({}, this.defaults, args), ['origin', 'key', 'secret', 'type']);

        return this.http.get(`https://${origin}.battle.net/oauth/token`, {
            auth: {
                username: key,
                password: secret
            },
            headers: {
                'User-Agent': `Node.js/${process.versions.node} Blizzard.js/${this.version}`,
            },
            params: {
                grant_type: 'client_credentials'
            }
        }).pipe(map(response => response.data)).toPromise()
    }

    /**
     * Check the details of an application token.
     *
     * @param {Object} [args]
     * @param {String} [args.token] The application token to be validated
     * @return {Promise} A thenable Promises/A+ reference
    */
    public async ValidateApplicationToken(args)
    {
        const { origin, key, secret } = pick(merge({}, this.defaults, args), ['origin', 'key', 'secret', 'type']);

        return this.http.get(`https://${origin}.battle.net/oauth/token`, {
            auth: {
                username: key,
                password: secret
            },
            headers: {
                'User-Agent': `Node.js/${process.versions.node} Blizzard.js/${this.version}`,
            },
            params: {
                grant_type: 'client_credentials'
            }
        }).pipe(map(response => response.data)).toPromise()
    }

    /**
     * Fetch World of Warcraft character data.
     *
     * @param {String} key ["index", "equipment", "encounter", "collections", "appearance", "achievements", "professions", "quests", "reputations", "specializations", "titles", "statistics", "mythic-keystone-profile"] Resource to check
     * @param {Object} args
     * @param {String} args.name The character name
     * @param {String} args.realm The realm name slug
     * @return {Promise} A thenable Promises/A+ reference
    */
    public async Character(key, { realm, name, ...args })
    {
        const params = {
            namespace: 'profile-eu'
        }

        return this.Get(
            `/profile/wow/character/${realm}/${name}` + (key ? `/${key}` : ''),
            merge({}, args, {
                params,
            }),
        )
    }

    public async GetRealms()
    {
        const args = {
            namespace: 'dynamic',
            locale: 'en_GB'
        };
        const response = await this.Get('/data/wow/connected-realm/index', args);

        if (response.connected_realms) {
            let promises = [];

            response.connected_realms.map(r => r.href.match(/\d+/g)).forEach(realmId => {
                promises.push(this.Get(`/data/wow/connected-realm/${realmId}`, args));
            });

            return Promise.all(promises);
        }
        else
            return [];
    }

    public async GetExpansions()
    {
        return (await this.Get('/data/wow/journal-expansion/index', {
            namespace: 'static',
            locale: 'en_GB'
        }))?.tiers;
    }

    public async GetExpansion(id: number)
    {
        return this.Get(`/data/wow/journal-expansion/${id}`, {
            namespace: 'static',
            locale: 'en_GB'
        });
    }

    public async GetInstances()
    {
        return this.Get(`/data/wow/journal-instance/index`, {
            namespace: 'static',
            locale: 'en_GB'
        });
    }

    public async GetInstance(id: number)
    {
        return this.Get(`/data/wow/journal-instance/${id}`, {
            namespace: 'static',
            locale: 'en_GB'
        });
    }

    public async GetEncounters()
    {
        return this.Get(`/data/wow/journal-encounter/index`, {
            namespace: 'static',
            locale: 'en_GB'
        });
    }

    public async GetEncounter(id: number)
    {
        return this.Get(`/data/wow/journal-encounter/${id}`, {
            namespace: 'static',
            locale: 'en_GB'
        });
    }

    public async GetMythicKeystoneSeasons()
    {
        return this.Get(`/data/wow/mythic-keystone/season/index`, {
            namespace: 'dynamic',
            locale: 'en_GB'
        });
    }

    public async GetMythicKeystoneSeason(id: number)
    {
        return this.Get(`/data/wow/mythic-keystone/season/${id}`, {
            namespace: 'dynamic',
            locale: 'en_GB'
        });
    }

    public async GetMythicKeystonePeriods()
    {
        return this.Get(`/data/wow/mythic-keystone/period/index`, {
            namespace: 'dynamic',
            locale: 'en_GB'
        });
    }

    public async GetMythicKeystonePeriod(id: number)
    {
        return this.Get(`/data/wow/mythic-keystone/period/${id}`, {
            namespace: 'dynamic',
            locale: 'en_GB'
        });
    }
}