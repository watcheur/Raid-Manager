# Raid Manager
Welcome to Raid-Manager project. This all included webapp will help you organize your guild events with usefull tools (calendar, exRT compliant notes, wishlist for characters, characters items tracking)

## Dependencies
    MySQL or MariaDB
    Redis
    NodeJS

## Config.json

You'll have to edit a config.json file at the root of your api's directory.
Here's the syntax:

```json
{
    "server": {
        "port": 3005
    },
    "blizzard": {
        "key": "",
        "secret": "",
        "locale": "",
        "origin": ""
    },
    "database": {
        "type": "",
        "host": "",
        "port": 3306,
        "username": "",
        "password": "",
        "database": "",
        "logging": true,
        "synchronize": true
    },
    "redis": {
        "host": "",
        "port": 0,
        "password": ""
    }
}
```

## TODO:

    Characters:
        - filter per role, class, name, etc...
        - Warning when socket or enchant is missing
        - Detail page (app)
        - Import wishlist from RaidBots

    Event:
        - Import event from game (csv addon ?)

    Note:
        - Add icons (raid, class & spells)
        - Add placeholder like (mage(1) mage(2) mage(3))
