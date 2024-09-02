import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EmailVerifyService } from './email-verify.service';
import { AllExceptionsFilter } from '../decorators/filters/errors.filter';
import { GetPayloadGuard } from '../decorators/guards/get-payload.guard';
import { Payload } from '../authorization/dto/payload.dto';
import { TokenDto } from './dto/token.dto';

@Controller('email-verify')
export class EmailVerifyController {
  constructor(private readonly emailVerifyService: EmailVerifyService) {}

  @Post('/')
  @UseGuards(GetPayloadGuard)
  @UseFilters(new AllExceptionsFilter())
  create(@Request() req: Request) {
    const user: Payload = req['user'];
    console.log(user);
    return this.emailVerifyService.create(user.id);
  }

  // @Get()
  // findAll() {
  //   return this.emailVerifyService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.emailVerifyService.findOne(+id);
  // }

  @Patch()
  @UseGuards(GetPayloadGuard)
  @UsePipes(ValidationPipe)
  verifyToken(@Request() req: Request, @Body() dto: TokenDto) {
    const user: Payload = req['user'];
    return this.emailVerifyService.update(user.id, dto.token);
  }
}
