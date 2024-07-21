import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateToolDto {
    @IsString()
    @IsNotEmpty()
    title:string;
    
    @IsString()
    @IsNotEmpty()
    description:string;
    
    @IsString()
    @IsNotEmpty()
    country:string;
    
    @IsString()
    @IsNotEmpty()
    city:string;
    
    @IsNumber()
    @IsNotEmpty()
    baseQuantity:number;
    
    @IsNumber()
    price:number;
}
