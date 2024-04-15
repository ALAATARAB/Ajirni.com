import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Req, ParseBoolPipe } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { AuthorizedGuard } from '../auth/guards/authorized.guard';
import { Request } from 'express';

@Controller('transaction')
@UseGuards(AuthorizedGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Patch(':id')
  async update(@Param('id',ParseIntPipe) id:number ,@Body('accepted') accepted:boolean,@Req() request : Request&{userId:number}) {
    return await this.transactionService.update(id,request.userId,(accepted));
  }

  @Post()
  async create(@Body() info:{toolId:number,period:number},@Req() request : Request&{userId:number}) {
    let {toolId,period} = info;
    return await this.transactionService.create(+toolId,request.userId,+period);
  }

  @Get()
  async findAll(@Req() request : Request&{userId:number}) {
    return await this.transactionService.findAll(request.userId);
  }

  @Get(':id')
  async findOne(@Param('id',ParseIntPipe) id: number) {
    return await this.transactionService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id',ParseIntPipe) id: number,@Req() request : Request&{userId:number}) {
    return await this.transactionService.delete(id,request.userId);
  }
}