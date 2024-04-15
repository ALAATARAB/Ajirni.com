import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { ToolService } from '../tool/tool.service';

@Injectable()
export class TransactionService {
  constructor(
     @InjectRepository(Transaction) private transactionRepo:Repository<Transaction>,
    private readonly toolService:ToolService
   ){}

  async create(toolId:number,userId:number,period:number) {
    let tool = await this.toolService.findOne(toolId);
    if(!tool) throw new NotFoundException("There is no tool like that "+toolId);
    await this.transactionRepo.save({ownerId:tool.userId,loanedId:userId,tool,period,accepted:false});
  }

  async findAll(userId : number) {
    return await this.transactionRepo.find({where:{ownerId:userId},relations:{tool:true}});
  }

  async findOne(id: number) {
    return await this.transactionRepo.findOne({where:{id},relations:{tool:true}});
  }

  async update(txnId:number,userId:number,accepted:boolean) {
    let txn = await this.transactionRepo.findOne({where:{id:txnId},relations:{tool:true}});
    if(!txn) throw new NotFoundException("There is no txn like this.");
    if(txn.ownerId !== userId) throw new ConflictException("You are not the owner.");
    if(!accepted) 
      return await this.transactionRepo.remove(txn);
    txn.accepted = true;
    await this.toolService.update(txn.tool.id,1);
    return await this.transactionRepo.save(txn);
  }
  
  async delete(txnId:number,userId:number) {
    let txn = await this.transactionRepo.findOne({where:{id:txnId},relations:{tool:true}});
    if(!txn) throw new NotFoundException();
    if(txn.ownerId !== userId) throw new ConflictException();
    await this.toolService.update(txn.tool.id,-1);
    return await this.transactionRepo.delete(txn);
  }
}
