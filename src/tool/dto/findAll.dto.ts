import { IsNumber, IsString } from "class-validator";

export class FindAllDTO {
    @IsString()
    title:string;
    
    @IsString()
    country:string;

    @IsString()
    city:string;
    
    @IsNumber()
    minPrice:number;

    @IsNumber()
    maxPrice:number;
}