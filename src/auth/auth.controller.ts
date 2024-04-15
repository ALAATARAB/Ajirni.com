import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDTO } from './dto/login.dto';
import { SignUpDTO } from './dto/signup.dto';
import { Request } from 'express';
import { ResetPasswordGuard } from './guards/resetPassword.guard';
import { EditPasswordDTO } from './dto/editPassword.dto';
import { ForgotPasswordDTO } from './dto/forgotPassword.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService : AuthService){}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @UsePipes(ValidationPipe)
    async logIn(@Body() info:LogInDTO) : Promise<{accessToken:string}> {
        return await this.authService.logIn(info);
    }
    
    @Post('signup')
    @HttpCode(HttpStatus.OK)
    @UsePipes(ValidationPipe)
    async signUp(@Body() info: SignUpDTO) : Promise<{accessToken:string}>{
        return await this.authService.signUp(info.userInfo,info.countryInfo);
    }
    
    @Post('forget-pass')
    @HttpCode(HttpStatus.OK)
    @UsePipes(ValidationPipe)
    async forgetPassword(@Body() info : ForgotPasswordDTO) {
        return await this.authService.forgetPassword(info.email);
    }
    
    @Post('reset-pass/:token')
    @HttpCode(HttpStatus.OK)
    @UsePipes(ValidationPipe)
    @UseGuards(ResetPasswordGuard)
    async editPassword(@Body() info:EditPasswordDTO,@Req() request : Request&{userId:number}) {
        let userId : number = request['userId'] as number;
        return await this.authService.resetPassword(userId,info.newPassword)
    }
}
