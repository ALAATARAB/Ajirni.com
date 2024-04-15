import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateToolDTO } from './dto/create-tool.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tool } from './entities/tool.entity';
import { Between, Like, Not, Repository } from 'typeorm';
import { Place } from '../user/entities/place.entity';
import { FindAllDTO } from './dto/findAll.dto';

@Injectable()
export class ToolService {
  constructor(
    @InjectRepository(Tool) private toolRepo:Repository<Tool>,
    @InjectRepository(Place) private placeRepo:Repository<Place>){}
  
  async create(createToolDto: CreateToolDTO,image:string,userId:number) : Promise<Tool> {
    let place = await this.placeRepo.findOne({
      where: { country: createToolDto.country, city: createToolDto.city },
    });
    if (!place) {
      throw new NotFoundException(
        `There is no place like that: ${createToolDto.country} ${createToolDto.city}`
      );
    }
    return await this.toolRepo.save({...createToolDto,place,image,userId});
  }
  
  async findAll(query : FindAllDTO,userId:number) {
    if(!query.title) return await this.toolRepo.find({relations:{place:true},where:{userId:Not(userId)}});
    let place = await this.placeRepo.find({where:{country:query.country,city:query.city}});
    if (!place) {
      throw new NotFoundException(
        `There is no place like that: ${query.country} ${query.city}`
      );
    }
    let tools = await this.toolRepo.find({relations:{place:true}, where:{
      userId: Not(userId),
      title : Like(`%${query.title}%`),
      place,
      price: Between(+query.minPrice,+query.maxPrice)
    }})
    return tools;
  }

  async findToolsForUser(userId: number) {
    const tools = await this.toolRepo.find({where:{userId},relations:{place:true}});
    return tools;
  }

  async findOne(toolId: number) {
    return await this.toolRepo.findOne({where:{id:toolId},relations:{place:true}});
  }

  async update(toolId:number,quantity:number) {
    let tool =  await this.toolRepo.findOne({where:{id:toolId}});
    if(!tool) throw new NotFoundException();
    
    return await this.toolRepo.save({...tool,usedQuantity:tool.usedQuantity+quantity});
  }
}