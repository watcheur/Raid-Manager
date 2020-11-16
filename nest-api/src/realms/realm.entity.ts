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
    
    @Column()
    category: string;
    
    /*
    @BeforeInsert()
    async slugName() {
        this.slug = slugify(this.name) 
    }
    */
}
