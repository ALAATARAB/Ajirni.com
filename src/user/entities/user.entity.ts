import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import bcryptjs from 'bcryptjs'
import { Place } from "./place.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    username:string;
    
    @Column({unique:true})
    email:string;
    
    @Column()
    password:string;
    
    @Column()
    phoneNumber:string;

    @Column()
    salt!:string;

    @ManyToOne(()=>Place)
    place:Place;

    async validatePassword(password : string) : Promise<boolean> {
        let hash = await bcryptjs.hash(password,this.salt);
        return (this.password === hash);
    }
}