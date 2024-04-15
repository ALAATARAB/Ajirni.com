import { Tool } from "../../tool/entities/tool.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id : number;
    // how many days
    @Column()
    period:number;
    
    @Column()
    ownerId: number;
    
    @Column()
    loanedId: number;

    @Column({default:false})
    accepted:boolean;
    
    @ManyToOne(() => Tool)
    tool: Tool;
}