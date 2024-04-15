import { Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LogInDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserInfoDTO,CountryInfoDTO } from './dto/signup.dto';
import { MailerService } from '../mailer/mailer.service';
import { ConfigService } from '@nestjs/config';
import { SendEmailDTO } from '../mailer/dto/sendEmailDTO.dto';

@Injectable()
export class AuthService {
    constructor(@Inject(UserService) private readonly userService:UserService,
    private readonly jwtService:JwtService,
    private readonly mailService:MailerService,
    private readonly configService:ConfigService){}

    private async assignToken(payload:any,expiresIn:string) {
        let options = {secret:this.configService.get<string>('JWT_SECRET'),expiresIn};
        return `Bearer:${await this.jwtService.signAsync(payload,options)}`
    }

    async logIn(logInDto : LogInDTO) : Promise<{accessToken:string}>{
        let {email,password} = logInDto;
        let user = await this.userService.findOneByEmail(email,password,true);
        const payload = {userId:user.id,username:user.username};
        return {accessToken: await this.assignToken(payload,'7d')};
    }
    
    async signUp(userInfoDto : UserInfoDTO,countryInfoDto:CountryInfoDTO) : Promise<{accessToken:string}>{
        let user = await this.userService.createUser(userInfoDto,countryInfoDto);
        const payload = {userId:user.id,username:user.username};
        return {accessToken: await this.assignToken(payload,'7d')};
    }
    
    async forgetPassword(email : string) : Promise<string> {
        let user = await this.userService.findOneByEmail(String(email),'',false);
        const payload = {userId:user.id,resetPassword:true};
        
        // assign token
        let token = await this.assignToken(payload,'15m');

        // link for reset password page
        let link = `<a href="${this.configService.get<string>("FRONT_END_DOMAINE")}/reset-password/${token}"> click </a>`;

        // send the link to the email
        let sendEmailDTO:SendEmailDTO = {recipient:{name:user.username,address:user.email},subject:"Reset Password",info:`Please click on the link : ${link}`};
        await this.mailService.sendEmail(sendEmailDTO);

        return "Reset Link Has Been Sent To Your Email Check It Out";
    }

    async resetPassword(userId:number,newPassword:string) : Promise<{message:string}> {
        await this.userService.updateUserPassword(userId,newPassword);
        return {message:"Password Successfully Updated."};
    }
}
