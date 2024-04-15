import { Type } from "class-transformer";
import { IsNotEmpty, IsNotEmptyObject, IsString, MinLength, ValidateNested } from "class-validator";

export class CountryInfoDTO {
    @IsString()
    @IsNotEmpty()
    country:string;
    
    @IsString()
    @IsNotEmpty()
    city:string;
}

export class UserInfoDTO {
    @IsString()
    @IsNotEmpty()
    username:string;
    
    @IsString()
    @IsNotEmpty()
    email:string;
    
    @IsString()
    @MinLength(8)
    password:string;
    
    @IsString()
    @IsNotEmpty()
    phoneNumber:string;
}

export class SignUpDTO {
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(()=>UserInfoDTO)
    userInfo:UserInfoDTO;
    
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(()=>CountryInfoDTO)
    countryInfo:CountryInfoDTO;
}