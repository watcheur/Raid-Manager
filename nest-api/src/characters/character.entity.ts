import { Exclude, Expose, Transform } from 'class-transformer';
import { MaxLength } from 'class-validator';
import { Player } from 'src/players/player.entity';
import { Realm } from 'src/realms/realm.entity';
import { Team } from 'src/teams/team.entity';
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
	JoinTable, Index, PrimaryColumn, ManyToOne, JoinColumn
} from 'typeorm';
import { CharacterItem } from './character.item.entity';
import { CharacterType, Race, Gender, Role, Faction, CharacterClass, CharacterSpec, Dps, Heal, Tank } from './enums';

@Entity()
export class Character {
    @PrimaryColumn()
    id: number;

    @Index()
    @Column()
    name: string;

    @ManyToOne(type => Realm, realm => realm.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'realm' })
    realm?: Realm;

    @Column({ name: 'realm' })
    realmId: number;

    @Index()
    @Column({ type: "enum", enum: CharacterType })
    type: CharacterType;

    @Index()
    @Column({ nullable: true })
    level?: number;

    @Column({ type: "enum", enum: Race, nullable: true })
    race?: Race;

    @Column({ type: "enum", enum: Gender, nullable: true })
    gender?: Gender;

    @Index()
    @Column({ type: "enum", enum: Faction, nullable: true })
    faction?: Faction;

    @Index()
    @Column({ type: "enum", enum: CharacterClass, nullable: true })
    class?: CharacterClass;

    @Index()
    @Column({ type: "enum", enum: CharacterSpec, nullable: true })
    spec?: CharacterSpec;

    @Expose({ name: 'role' })
    get role(): Role {
        if (Heal.indexOf(this.spec) >= 0)
            return Role.HEAL;
        if (Tank.indexOf(this.spec) >= 0)
            return Role.TANK;
        return Role.DPS;
    }

    @Column({ nullable: true })
    avg?: number;

    @Column({ nullable: true })
    equipped?: number;

    @Expose({ name: 'weekly' })
    get weekly(): number
    {
        if (this.weeklys)
            return Math.max.apply(null, this.weeklys.map(w => w.level));
        return 0;
    }

    @OneToMany(type => Weekly, weekly => weekly.character)
    weeklys?: Weekly[];

    @OneToMany(type => CharacterItem, ci => ci.character)
    items?: CharacterItem[];

    @ManyToMany(type => Team, team => team.characters)
    teams?: Team[];

    @Exclude()
    @ManyToMany(type => Player, player => player.characters)
    players?: any[];

    @Expose({ name: 'player' })
    get player(): Player
    {
        if (this.players)
            return this.players.find(pc => pc.player)?.player;
        return null;
    }

    @CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}