import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { FindAllDTO } from '../tool/dto/findAll.dto';
import { Place } from './entities/place.entity';
import { Request } from 'express';
import { AuthorizedGuard } from '../auth/guards/authorized.guard';
import { ToolService } from '../tool/tool.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService : UserService,private readonly toolService:ToolService){}

    @Get('fill')
    fillAllTheCountries() {
        return this.userService.fillTheCountries();
    }

    @Get('countries')
    async getAllCountries() : Promise<Place[]>{
        return this.userService.getAllCountries();
    }

    @Get('profile')
    @UseGuards(AuthorizedGuard)
    async getMyProfile(@Req() request : Request&{userId:number}) {
        let userId : number = request['userId'];
        return await this.userService.findOneById(userId);
    }

    @Get('tool')
    @UseGuards(AuthorizedGuard)
    async getMyTools(@Req() request : Request&{userId:number}) {
        let userId : number = request['userId'];
        return await this.toolService.findToolsForUser(userId);
    }

    @Get(':userId')
    async findOne(@Param('userId') userId:number) {
        return await this.userService.findOneById(userId);
    }
    
    @Delete(':id')
    async remove(@Param('id',ParseIntPipe) userId : number) {
        return await this.userService.deleteUser(userId);
    }
    
}
