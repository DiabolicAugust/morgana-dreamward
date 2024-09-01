import {
  Body,
  Controller,
  Post,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { CreateUserDto } from '../person/user/dto/create-user.dto';
import { AllExceptionsFilter } from '../decorators/filters/errors.filter';
import { LoginUserDto } from './dto/login.dto';

@Controller('authorization')
export class AuthorizationController {
  constructor(private readonly authorizationService: AuthorizationService) {}

  @Post('/registration')
  @UseFilters(new AllExceptionsFilter())
  @UsePipes(ValidationPipe)
  async registration(@Body() dto: CreateUserDto) {
    return this.authorizationService.registration(dto);
  }

  @Post('/login')
  @UseFilters(new AllExceptionsFilter())
  @UsePipes(ValidationPipe)
  async login(@Body() dto: LoginUserDto) {
    return this.authorizationService.login(dto);
  }
}
