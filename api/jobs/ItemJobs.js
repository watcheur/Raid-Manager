const TypeORM = require('typeorm');
const url = require('url');

const Entities = require('../entity/Entities');
const blizzard = require('blizzard.js').initialize(require('../config.json').blizzard);
const Logger = require('../utils/Logger');

function ItemUpdate(id, cb) {
    Logger.info('Start Item update job', { item: id })

    const repo = TypeORM.getRepository(Entities.Item);

    repo
        .createQueryBuilder("i")
        .where("i.id = :id", { id: id })
        .getOne()
        .then((item) => {

            if (item.updated) {
                Logger.info('Item already updated');
                return cb();
            }

            blizzard
                .getApplicationToken()
                .then(response => {
                    blizzard.defaults.token = response.data.access_token;

                    let params = {
                        access_token: blizzard.defaults.token,
                        locale: 'en_US',
                        namespace: 'profile-EU'
                    }

                    try
                    {
                        blizzard.defaults.token = response.data.access_token;
    
                        let params = {
                            locale: 'en_GB',
                            namespace: 'static'
                        }
        
                        blizzard.get(`/data/wow/item/${id}`, params)
                            .then(itemResponse => {
                                let update = {
                                    name: itemResponse.data.name,
                                    quality: itemResponse.data.quality.type,
                                    level: itemResponse.data.level,
                                    slot: itemResponse.data.inventory_type.type,
                                    updated: new Date()
                                }

                                TypeORM.getConnection()
                                    .createQueryBuilder()
                                    .update(Entities.Item)
                                    .set(update)
                                    .where("id = :id", { id: id })
                                    .execute()
                                    .then(query => {
                                        Logger.info('End Item update job', { item: id })
                                        cb(null, update);
                                    })
                                    .catch(err => {
                                        Logger.error('Item update query error', err);
                                        cb(new Error('Item update query error'));
                                    })
                            })
                            .catch(err => {
                                if (err.response)
                                    Logger.error('Blizzard token access failed', { status: err.response.status, statusText: err.response.statusText });
                                else
                                    Logger.error('Code error', err);
                            });
                    }
                    catch (e)
                    {
                        Logger.error(e);
                        cb(e);
                    }
                })
                .catch(err => {
                    if (err.response)
                        Logger.error('Blizzard token access failed', { status: err.response.status, statusText: err.response.statusText });
                    else
                        Logger.error('Something else failed... :', { err: err });
                    cb(new Error('Blizzard token access failed'));
                })
        })
        .catch(err => {
            cb(err);
        });
}

function ItemUpdateMedia(id, cb) {
    Logger.info('Start Item update job', { item: id })

    const repo = TypeORM.getRepository(Entities.Item);

    repo
        .createQueryBuilder("i")
        .where("i.id = :id", { id: id })
        .getOne()
        .then((item) => {

            if (!item)
            {
                Logger.error('Item not found');
                return cb();
            }

            if (item.media) {
                Logger.info('Item already updated');
                return cb();
            }

            blizzard
                .getApplicationToken()
                .then(response => {
                    blizzard.defaults.token = response.data.access_token;

                    let params = {
                        access_token: blizzard.defaults.token,
                        locale: 'en_US',
                        namespace: 'profile-EU'
                    }

                    try
                    {
                        blizzard.defaults.token = response.data.access_token;
    
                        let params = {
                            locale: 'en_GB',
                            namespace: 'static'
                        }

                        blizzard.get(`/data/wow/media/item/${id}`, params)
                            .then(itemResponse => {
                                var ico = itemResponse.data.assets.find(a => a.key === 'icon');
                                if (!ico)
                                    return cb(new Error('asset not found'));
                                
                                TypeORM.getConnection()
                                    .createQueryBuilder()
                                    .update(Entities.Item)
                                    .set({ media: url.parse(ico.value).pathname })
                                    .where("id = :id", { id: id })
                                    .execute()
                                    .then(query => {
                                        Logger.info('End Item update job', { item: id })
                                        cb(null, { media: url.parse(ico.value).pathname });
                                    })
                                    .catch(err => {
                                        Logger.error('Item update query error', err);
                                        cb(new Error('Item update query error'));
                                    })
                            })
                            .catch(err => {
                                console.log(err);
                                if (err.response)
                                    Logger.error('Blizzard token access failed', { status: err.response.status, statusText: err.response.statusText });
                                else
                                    Logger.error('Code error ', err);
                            });
                    }
                    catch (e)
                    {
                        Logger.error(e);
                        cb(e);
                    }
                })
                .catch(err => {
                    if (err.response)
                        Logger.error('Blizzard token access failed', { status: err.response.status, statusText: err.response.statusText });
                    else
                        Logger.error('Something else failed... :', { err: err });
                    cb(new Error('Blizzard token access failed'));
                })
        })
        .catch(err => {
            Logger.error(err);
            cb(err);
        });
}

module.exports = {
    Update: (itemId, done) => ItemUpdate(itemId, done),
    UpdateMedia: (itemId, done) => ItemUpdateMedia(itemId, done)
}