import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class ResetPasswordGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService,
                private readonly configService:ConfigService) {}
                
        async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        
        const token = this.extractTokenFromHeader(request);
        if (!token) {
          throw new UnauthorizedException();
        }
        try {
          const payload = await this.jwtService.verifyAsync(
            token,
            {
              secret: this.configService.get<string>("JWT_SECRET")
            }
          );
          
          if(!payload.resetPassword) throw new UnauthorizedException();

          // We're assigning the payload to the request object here
          request['userId'] = payload.userId;
        } catch {
          throw new UnauthorizedException();
        }
        return true;
      }
    
      private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.params.token?.split(':') ?? [];
        return (type === 'Bearer') ? token : undefined;
      }

}