import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Place {
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    country:string;

    @Column()
    city:string;
}