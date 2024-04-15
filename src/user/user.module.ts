import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { Place } from './entities/place.entity';
import { ToolModule } from '../tool/tool.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports:[TypeOrmModule.forFeature([User,Place]),ConfigModule,ToolModule],
  exports:[UserService]
})
export class UserModule {}
