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

    // TODO: This Called only once 
    // @Get('fill')
    // fillAllTheCountries() {
    //     return this.userService.fillTheCountries();
    // }
    
    @Patch(':id')
    async update(@Param('id',ParseIntPipe) userId:number) {
        
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

    @Delete('clearAll')
    async deleteAll() {
        return await this.userService.clearUsers();
    }
    
    // TODO: just for admins
    @Delete(':id')
    async remove(@Param('id',ParseIntPipe) userId : number) {
        return await this.userService.deleteUser(userId);
    }
    
    
    // @Get()
    // async getUser(@Body('email') email:string) {
    //     return await this.userService.findOneByEmail(email,'',false);
    // }

}
