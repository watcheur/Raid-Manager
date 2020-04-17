const Typeorm = require('typeorm');
const CharacterEntity = require('../entity/Character');
const WeeklyEntity = require('../entity/Weekly');
const blizzard = require('blizzard.js').initialize(require('../config.json').blizzard);
const Logger = require('../utils/Logger');
const Enums = require('../utils/Enums');

function CharacterUpdate(id, cb)
{
    Logger.info('Start Character update job', { char: id })
    const repo = Typeorm.getRepository(CharacterEntity.name);
    const props = [ 'head', 'neck', 'shoulder', 'back', 'chest', 'wrist', 'hands', 'waist', 'legs', 'feet', 'finger_1', 'finger_2', 'trinket_1', 'trinket_2', 'main_hand', 'off_hand' ]

    repo
        .createQueryBuilder("c")
        .where("c.id = :id", { id: id })
        .getOne()
        .then((char) => {
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
                        blizzard.wow.character('index', { origin: 'eu', realm: char.realm, name: char.name.toLowerCase(), params: params })
                            .then(res => {
                                switch (res.data.gender.type) {
                                    case "MALE": char.gender = Enums.Characters.Gender.Male; break;
                                    case "FEMALE": char.gender = Enums.Characters.Gender.Female; break;
                                    default: char.gender = Enums.Characters.Gender.Unknown; break;
                                }

                                switch (res.data.faction.type) {
                                    case "HORDE": char.faction = Enums.Characters.Faction.Horde; break;
                                    case "ALLIANCE": char.faction = Enums.Characters.Faction.Alliance; break;
                                    default: char.faction = Enums.Characters.Faction.Unknown; break;
                                }

                                char.race = res.data.race.id;
                                char.class = res.data.character_class.id;
                                char.spec = res.data.active_spec.id;
                                char.level = res.data.level;
                                char.avg = res.data.average_item_level;
                                char.equipped = res.data.equipped_item_level;
                                
                                blizzard.wow.character('equipment', { origin: 'eu', realm: char.realm, name: char.name.toLowerCase(), params: params })
                                    .then(res => {
                                        res.data.equipped_items.forEach(item => {
                                            if (props.indexOf(item.slot.type.toLowerCase()) >= 0)
                                                char[item.slot.type.toLowerCase()] = item.level.value
                                        });

                                        char.azerite = 1 + ((char.neck - 280 - 45 - 10) / 2); // baselevel + ((neck - base - magni - mother) / 2)
                                        char.updated = new Date();

                                        Typeorm.getConnection()
                                                .createQueryBuilder()
                                                .update(CharacterEntity.name)
                                                .set(char)
                                                .where("id = :id", { id: id })
                                                .execute()
                                                .then(query => {
                                                    Logger.info('End Character update job', { char: id })
                                                    cb(null, char);
                                                })
                                                .catch(err => {
                                                    Logger.error('Update query error', err);
                                                    cb(new Error('Update query error'));
                                                })
                                    })
                                    .catch(err => {
                                        Logger.error('Blizzard API Equipment failed', { status: err.response.status, statusText: err.response.statusText, character: { id: id, name: char.name, realm: char.realm } });
                                        cb(new Error('Blizzard API Failed'));
                                    });
                            })
                            .catch(err => {
                                Logger.error('Blizzard API failed', { status: err.response.status, statusText: err.response.statusText, character: { id: id, name: char.name, realm: char.realm } });
                                cb(new Error('Blizzard API Failed'));
                            });
                    }
                    catch (e)
                    {
                        Logger.error(e);
                        cb(e);
                    }
                })
                .catch(err => {
                    Logger.error('Blizzard token access failed', { status: err.response.status, statusText: err.response.statusText });
                    cb(new Error('Blizzard token access failed'));
                })
        })
        .catch(err => {
            cb(err);
        });
}

module.exports = {
    Update: (characterId, done) => CharacterUpdate(characterId, done)
}