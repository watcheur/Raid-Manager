import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    BeforeInsert,
    OneToMany,
    ManyToMany,
    JoinTable,
    Index
} from 'typeorm';
import slugify from 'slugify';

@Entity()
export class Realm {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    @Index()
    name: string;
    
    @Column()
    slug: string;
    
    @Index()
    @Column()
    category: string;

    @Index()
    @Column()
    region: string;

    @Column()
    locale: string;

    @Column()
    timezone: string;

    @Index()
    @Column()
    group: number;
    
    /*
    @BeforeInsert()
    async slugName() {
        this.slug = slugify(this.name) 
    }
    */
}
