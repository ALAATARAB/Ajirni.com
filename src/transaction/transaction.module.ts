import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { ToolModule } from '../tool/tool.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService],
  imports:[TypeOrmModule.forFeature([Transaction]),ToolModule,AuthModule]
})
export class TransactionModule {}
