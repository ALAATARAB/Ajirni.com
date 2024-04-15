import { Place } from "../../user/entities/place.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Tool {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({type:"varchar"})
    title:string;

    @Column()
    image:string;
    
    @Column({type:"text"})
    description:string;

    @Column({default:0})
    usedQuantity:number;
    
    @Column()
    baseQuantity:number;

    // price in 1 day
    @Column()
    price:number;
    
    @Column({nullable:true})
    userId:number;

    @ManyToOne(()=>Place)
    place:Place;

}