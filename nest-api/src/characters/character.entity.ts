import { Exclude } from 'class-transformer';
import { MaxLength } from 'class-validator';
import { Player } from 'src/players/player.entity';
import { Realm } from 'src/realms/realm.entity';
import { Weekly } from 'src/weeklys/weekly.entity';
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	BeforeInsert,
	OneToMany,
	ManyToMany,
	JoinTable, Index, PrimaryColumn, ManyToOne
} from 'typeorm';

export enum Type {
    MAIN,
    ALT,
    ALTFUN
}

export enum Role {
    DPS,
    HEAL,
    TANK
}

export enum Race {
    Human = 1,
    Orc,
    Dwarf,
    NightElf,
    Undead,
    Tauren,
    Gnome,
    Troll,
    Goblin,
    BloodElf,
    Draenei,
    Worgen = 22,
    PandarenN = 24,
    PandarenA,
    PandarenH,
    Nightborne,
    HightmountainTauren,
    VoidElf,
    LightforgedDraenei,
    ZandalariTroll,
    DarkIronDwarf = 34,
    Vulpera,
    MagharOrc,
    Mechagnome
}

export enum Gender {
    Male,
    Female,
    Unknown
}

export enum Faction {
    Horde,
    Alliance,
    Neutral
}

export enum Class {
    Warrior = 1,
    Paladin,
    Hunter,
    Rogue,
    Priest,
    DeathKnight,
    Shaman,
    Mage,
    Warlock,
    Monk,
    Druid,
    DemonHunter
}

export enum Spec {
    Warrior_Arms = 71,
    Warrior_Fury = 72,
    Warrior_Protection = 73,

    Paladin_Holy = 65,
    Paladin_Protection = 66,
    Paladin_Retribution = 70,

    Hunter_BeastMastery = 253,
    Hunter_Marksmanship = 254,
    Hunter_Survival = 255,

    Rogue_Assassination = 259,
    Rogue_Outlaw = 260,
    Rogue_Subtlety = 261,

    Priest_Discipline = 256,
    Priest_Holy = 257,
    Priest_Shadow = 258,

    DeathKnight_Blood = 250,
    DeathKnight_Frost = 251,
    DeathKnight_Unholy = 252,

    Shaman_Elemental = 262,
    Shaman_Enhancement = 263,
    Shaman_Restoration = 264,

    Mage_Arcane = 62,
    Mage_Fire = 63,
    Mage_Frost = 64,

    Warlock_Afflication = 265,
    Warlock_Demonology = 266,
    Warlock_Destruction = 267,

    Monk_Brewmaster = 268,
    Monk_Windwalker = 269,
    Monk_Mistweaver = 270,

    Druid_Balance = 102,
    Druid_Feral = 103,
    Druid_Guardian = 104,
    Druid_Restoration = 105,

    DemonHunter_Havoc = 577,
    DemonHunter_Vengeance = 581
}

export const Dps: Spec[] = [
    Spec.DeathKnight_Frost,
    Spec.DeathKnight_Unholy,

    Spec.DemonHunter_Havoc,

    Spec.Druid_Balance,
    Spec.Druid_Feral,

    Spec.Hunter_BeastMastery,
    Spec.Hunter_Marksmanship,
    Spec.Hunter_Survival,

    Spec.Mage_Arcane,
    Spec.Mage_Frost,
    Spec.Mage_Fire,

    Spec.Monk_Windwalker,

    Spec.Paladin_Retribution,

    Spec.Priest_Shadow,

    Spec.Rogue_Assassination,
    Spec.Rogue_Outlaw,
    Spec.Rogue_Subtlety,

    Spec.Shaman_Elemental,
    Spec.Shaman_Enhancement,

    Spec.Warlock_Afflication,
    Spec.Warlock_Demonology,
    Spec.Warlock_Destruction,

    Spec.Warrior_Arms,
    Spec.Warrior_Fury
]

export const Heal: Spec[] = [
    Spec.Druid_Restoration,
    Spec.Monk_Mistweaver,
    Spec.Priest_Holy,
    Spec.Druid_Restoration,
    Spec.Priest_Discipline,
    Spec.Paladin_Holy
]

export const Tank: Spec[] = [
    Spec.DeathKnight_Blood,
    Spec.DemonHunter_Vengeance,
    Spec.Druid_Guardian,
    Spec.Paladin_Protection,
    Spec.Warrior_Protection,
    Spec.Monk_Brewmaster
]

@Entity()
export class Character {
    @PrimaryColumn()
    id: number;

    @Index()
    @Column()
    name: string;

    @Index()
    @ManyToOne(type => Realm, realm => realm.id)
    realm: Realm;

    @Index()
    @Column({ type: "enum", enum: Type })
    type: Type;

    @Index()
    @Column({ nullable: true })
    level: number;

    @Column({ type: "enum", enum: Race, nullable: true })
    race: Race;

    @Column({ type: "enum", enum: Gender, nullable: true })
    gender: Gender;

    @Index()
    @Column({ type: "enum", enum: Faction, nullable: true })
    faction: Faction;

    @Index()
    @Column({ type: "enum", enum: Class, nullable: true })
    class: Class;

    @Index()
    @Column({ type: "enum", enum: Spec, nullable: true })
    spec: Spec;

    get role(): Role {
        if (Heal.indexOf(this.spec) >= 0)
            return Role.HEAL;
        if (Tank.indexOf(this.spec) >= 0)
            return Role.TANK;
        return Role.DPS;
    }

    @Column({ nullable: true })
    avg: number;

    @Column({ nullable: true })
    equipped: number;

    @CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Index()
    @ManyToOne(type => Player, player => player.characters, { cascade: true })
    player: Player;

    @OneToMany(type => Weekly, weekly => weekly.character)
    weeklys: Weekly[];
    
    /*
    @Index()
    @ManyToOne(type => Encounter, encounter => encounter.items)
    source: Encounter;
    */
}