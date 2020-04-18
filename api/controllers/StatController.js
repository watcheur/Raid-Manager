const TypeORM = require('typeorm');
const Entities = require('../entity/Entities');
const Errs = require('restify-errors');
const Logger = require('../utils/Logger');
const DefaultController = require('./DefaultController');
const Enums = require('../utils/Enums');

class StatController extends DefaultController  {
    AvgIlvl = async (req, res, next) => {
        try {
            let avgs = await TypeORM.getRepository(Entities.Character)
                .createQueryBuilder()
                .select('type')
                .addSelect('AVG(avg)', 'avg')
                .groupBy('type')
                .getRawMany();

            let main = 0, alts = 0, altsfun = 0
            avgs.forEach(r => {
                if (r.type == Enums.Characters.Type.MAIN)
                    main = parseInt(r.avg);
                if (r.type == Enums.Characters.Type.ALT)
                    alts = parseInt(r.avg);
                if (r.type == Enums.Characters.Type.ALT_FUN)
                    altsfun = parseInt(r.avg);
            })

            res.send({
                err: false,
                data: {
                    mains: main,
                    alts: alts,
                    altsfun: altsfun
                }
            })
            next()
        }
        catch(err) {
            Logger.error('Average ilvl error', err);
            next(new Errs.InternalError('DatabaseError'));
        }
    }

    AvgAzerite = async (req, res, next) => {
        try {
            let avgs = await TypeORM.getRepository(Entities.Character)
                .createQueryBuilder()
                .select('type')
                .addSelect('AVG(azerite)', 'avg')
                .groupBy('type')
                .getRawMany();

            let main = 0, alts = 0, altsfun = 0
            avgs.forEach(r => {
                if (r.type == Enums.Characters.Type.MAIN)
                    main = parseInt(r.avg);
                if (r.type == Enums.Characters.Type.ALT)
                    alts = parseInt(r.avg);
                if (r.type == Enums.Characters.Type.ALT_FUN)
                    altsfun = parseInt(r.avg);
            })

            res.send({
                err: false,
                data: {
                    mains: main,
                    alts: alts,
                    altsfun: altsfun
                }
            })
            next()
        }
        catch(err) {
            Logger.error('Average azerite error', err);
            next(new Errs.InternalError('DatabaseError'));
        }
    }

    WeeklyDone = async (req, res, next) => {
        try {
            let rosters = await TypeORM.getRepository(Entities.Character)
                .createQueryBuilder()
                .select('type', 'type')
                .addSelect('COUNT(id)', 'count')
                .groupBy('type')
                .getRawMany();

            let runs = await TypeORM.getRepository(Entities.Weekly)
                .createQueryBuilder('w')
                .select('c.type')
                .addSelect('COUNT(DISTINCT c.id)', 'runs')
                .innerJoin('character', 'c', 'c.id = w.character')
                .where('w.period = 746')
                .groupBy('c.type')
                .getRawMany();

            let mains = { runs: 0, roster: 0, percent: 0 };
            let alts = { runs: 0, roster: 0, percent: 0 };
            let altsFun = { runs: 0, roster: 0, percent: 0 };

            rosters.forEach(r => {
                if (r.type == Enums.Characters.Type.MAIN)
                    mains.roster = parseInt(r.count);
                if (r.type == Enums.Characters.Type.ALT)
                    alts.roster = parseInt(r.count);
                if (r.type == Enums.Characters.Type.ALT_FUN)
                    altsFun.roster = parseInt(r.count);
            })

            runs.forEach(r => {
                if (r.c_type == Enums.Characters.Type.MAIN)
                    mains.runs = parseInt(r.runs);
                if (r.c_type == Enums.Characters.Type.ALT)
                    alts.runs = parseInt(r.runs);
                if (r.c_type == Enums.Characters.Type.ALT_FUN)
                    altsFun.runs = parseInt(r.runs);
            })

            if (mains.roster > 0)
                mains.percent = ((100 * mains.runs) / mains.roster);
            if (alts.roster > 0)
                alts.percent = ((100 * alts.runs) / alts.roster);
            if (altsFun.roster > 0)
                altsFun.percent = ((100 * altsFun.runs) / altsFun.roster);

            res.send({
                err: false,
                data: {
                    mains: mains,
                    alts: alts,
                    altsfun: altsFun
                }
            })
            next()
        }
        catch(err) {
            Logger.error('Weekly done error', err);
            next(new Errs.InternalError('DatabaseError'));
        }
    }


}

module.exports = StatController;