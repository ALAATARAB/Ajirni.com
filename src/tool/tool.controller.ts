import { Controller, Get, Post, Body, Param, UseGuards, ParseIntPipe, Req, UploadedFile, UseInterceptors, UsePipes, ValidationPipe, Res, Query } from '@nestjs/common';
import { ToolService } from './tool.service';
import { CreateToolDTO } from './dto/create-tool.dto';
import { Express , Request, Response } from 'express';
import { AuthorizedGuard } from '../auth/guards/authorized.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from './multerConfig';
import { CreateToolPipe } from './pipes/createTool.pipe';
import { FindAllDTO } from './dto/findAll.dto';

@Controller('tool')
export class ToolController {
  constructor(private readonly toolService: ToolService) {}
  
  @Post()
  @UseGuards(AuthorizedGuard)
  @UsePipes(CreateToolPipe,ValidationPipe)
  @UseInterceptors(FileInterceptor('image',multerConfig))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() info:CreateToolDTO,
    @Req() request : Request&{userId:number}
      )
  {
    info = JSON.parse(JSON.stringify(info));
    return this.toolService.create(info,file.filename,request.userId);
  }
  
  @Get()
  @UseGuards(AuthorizedGuard)
  async findAll(@Query() query : FindAllDTO,@Req() request : Request&{userId:number}) {
    return this.toolService.findAll(query,request.userId);
  }
  
  @Get('to-user/:id')
  @UseGuards(AuthorizedGuard)
  async findToolsForUser(@Param('id',ParseIntPipe) userId: number) {
    return this.toolService.findToolsForUser(userId);
  }
  
  @Get('image/:id')
  async getImage(@Param('id') imageId: string,@Res() res:Response) {
    return res.sendFile(imageId,{root:'uploads'});
  }
  
  @Get(':id')
  @UseGuards(AuthorizedGuard)
  async findOne(@Param('id',ParseIntPipe) toolId: number) {
    return this.toolService.findOne(toolId);
  }
}