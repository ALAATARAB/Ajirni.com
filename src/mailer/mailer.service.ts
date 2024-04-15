import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer';
import { SendEmailDTO } from './dto/sendEmailDTO.dto';

@Injectable()
export class MailerService {
    constructor(private readonly configService:ConfigService) {}

    private mailTransporter() {
        const transporter = nodemailer.createTransport({
            host: this.configService.get<string>('MAIL_HOST'),
            port: this.configService.get<number>('MAIL_PORT'),
            secure: false,
            auth: {
              user: this.configService.get<string>('MAIL_USER'),
              pass: this.configService.get<string>('MAIL_PASSWORD'),
            },
        });
        return transporter;
    }

    async sendEmail(sendEmailDTO : SendEmailDTO) {
        let transporter = this.mailTransporter();

        let options: Mail.Options = {
            from:{
                name: this.configService.get<string>('APP_NAME') as string,
                address: this.configService.get<string>('DEFAULT_MAIL_FROM') as string,
            },
            to : sendEmailDTO.recipient,
            subject: sendEmailDTO.subject,
            html:`<p>${sendEmailDTO.info}</p>`,
        }
        try {
            let res = await transporter.sendMail(options);
            return res;
        } catch (error) {
            throw new ConflictException("Try again later");
        }
    }
}
