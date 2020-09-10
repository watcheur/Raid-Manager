const TypeORM = require('typeorm');
const Entities = require('../entity/Entities');
const Queues = require('../utils/Queues');
const blizzard = require('blizzard.js').initialize(require('../config.json').blizzard);
const Logger = require('../utils/Logger');
const Enums = require('../utils/Enums');
const Socket = require('../utils/Socket');

function CharacterUpdate(id, cb)
{
    Logger.info('Start Character update job', { char: id })
    const repo = TypeORM.getRepository(Entities.Character);
    //const props = [ 'head', 'neck', 'shoulder', 'back', 'chest', 'wrist', 'hands', 'waist', 'legs', 'feet', 'finger_1', 'finger_2', 'trinket_1', 'trinket_2', 'main_hand', 'off_hand' ]

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
                        blizzard.wow.character('index', { origin: 'eu', realm: char.realm.toLowerCase(), name: char.name.toLowerCase(), params: params })
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
                                
                                blizzard.wow.character('equipment', { origin: 'eu', realm: char.realm.toLowerCase(), name: char.name.toLowerCase(), params: params })
                                    .then(res => {
                                        let neck = 0;
                                        let items = [];
                                        let characterItems = [];
                                        res.data.equipped_items.forEach(ei => {
                                            /*
                                            if (props.indexOf(item.slot.type.toLowerCase()) >= 0)
                                                char[item.slot.type.toLowerCase()] = item.level.value
                                            */

                                            let BlizzardItem = {
                                                id: ei.item.id,
                                                slot: ei.slot.type,
                                                created: new Date()
                                            };
                                            items.push(BlizzardItem);

                                            characterItems.push({
                                                quality: ei.quality.type,
                                                level: ei.level.value,
                                                bonuses: (ei.bonus_list || []).join(':'),
                                                sockets: (ei.sockets ? ei.sockets.map(socket => (socket.item ? socket.item.id : 0)).join(':') : null),
                                                enchantments: (ei.enchantments ? ei.enchantments.map(enchant => enchant.enchantment_id).join(':') : null),
                                                slot: ei.slot.type,
                                                item: ei.item.id,
                                                character: char.id
                                            });

                                            if (ei.slot.type == 'NECK')
                                                neck = ei.level.value;
                                        });

                                        TypeORM.getRepository(Entities.Item).save(items)
                                            .then(itemsRes => {
                                                itemsRes.map(item => Queues.Item.add({ item: item.id }));

                                                TypeORM.getConnection()
                                                    .createQueryBuilder()
                                                    .delete()
                                                    .from(Entities.CharacterItem)
                                                    .where('character = :id', { id : char.id })
                                                    .execute()
                                                    .then(delRes => {
                                                        TypeORM.getRepository(Entities.CharacterItem).save(characterItems).catch(err => {
                                                            Logger.error('Character Items save failed', err);
                                                        });
                                                    })
                                                    .catch(err => {
                                                        Logger.error('Character Items deletion failed', err);
                                                        cb(new Error('Character Items deletion failed'));
                                                    });

                                                //let neck = characterItems.find(i => i.slot == "NECK");
                                                if (neck) {
                                                    char.azerite = 1 + ((neck - 280 - 45 - 10) / 2); // baselevel + ((neck - base - magni - mother) / 2)
                                                    if (char.azerite < 0)
                                                        char.azerite = null;
                                                }
                                                else
                                                    char.azerite = null;
                                                char.updated = new Date();

                                                TypeORM.getConnection()
                                                        .createQueryBuilder()
                                                        .update(Entities.Character)
                                                        .set(char)
                                                        .where("id = :id", { id: id })
                                                        .execute()
                                                        .then(query => {
                                                            Logger.info('End Character update job', { char: id })
                                                            cb(null, char);
                                                            Socket.Emit(Socket.Channels.Character, {
                                                                action: Socket.Action.Character.Update,
                                                                data: {
                                                                    character: char
                                                                }
                                                            });
                                                        })
                                                        .catch(err => {
                                                            Logger.error('Update query error', err);
                                                            cb(new Error('Update query error'));
                                                        })
                                            })
                                            .catch(err => {
                                                Logger.error('Items save failed', err);
                                                cb(new Error('Items save fail'));
                                            });
                                    })
                                    .catch(err => {
                                        if (err.response)
                                            Logger.error('Blizzard API Equipment failed', { status: err.response.status, statusText: err.response.statusText, character: { id: id, name: char.name, realm: char.realm } });
                                        else
                                            Logger.error('Error', err);
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
                    if (err.response)
                        Logger.error('Blizzard token access failed', { status: err.response.status, statusText: err.response.statusText });
                    else
                        Logger.error('Code error', err);
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