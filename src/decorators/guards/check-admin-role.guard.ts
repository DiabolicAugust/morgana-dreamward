import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Payload } from '../../authorization/dto/payload.dto';
import { Role } from '../../data/enums/role.enum';
import { Strings } from '../../data/strings';

@Injectable()
export class CheckAdminRoleGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }
    const payload: Payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    });

    console.log(payload);

    if (payload.role != Role.ADMIN)
      throw new HttpException(
        Strings.youNeedAdminRole,
        HttpStatus.UNAUTHORIZED,
      );

    request['user'] = payload;
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
