import { Module } from '@nestjs/common';
import { ToolService } from './tool.service';
import { ToolController } from './tool.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tool } from './entities/tool.entity';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from './multerConfig';
import { Place } from '../user/entities/place.entity';

@Module({
  controllers: [ToolController],
  providers: [ToolService],
  imports: [TypeOrmModule.forFeature([Tool,Place]),
  MulterModule.register(multerConfig)],
  exports:[ToolService]
})
export class ToolModule {}
