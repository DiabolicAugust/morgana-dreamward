import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  UseFilters,
  Request,
  Query,
} from '@nestjs/common';
import { DreamsService } from './dreams.service';
import { CreateDreamDto, UpdateDreamDto } from './dto/create-dream.dto';
import { GetPayloadGuard } from '../decorators/guards/get-payload.guard';
import { AllExceptionsFilter } from '../decorators/filters/errors.filter';
import { Payload } from '../authorization/dto/payload.dto';
import { PaginationGetDto } from '../fandoms/dto/pagination-get.dto';
import { IsAuthorGuard } from '../decorators/guards/is-author.guard';

@Controller('dreams')
export class DreamsController {
  constructor(private readonly dreamsService: DreamsService) {}

  @Post()
  @UseGuards(GetPayloadGuard)
  @UsePipes(ValidationPipe)
  @UseFilters(AllExceptionsFilter)
  create(@Body() dto: CreateDreamDto, @Request() req: Request) {
    const user: Payload = req['user'];
    return this.dreamsService.create(dto, user.id);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseFilters(AllExceptionsFilter)
  findAll(@Query() dto: PaginationGetDto) {
    return this.dreamsService.findAll(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dreamsService.get(id);
  }

  @Patch(':id')
  @UseGuards(GetPayloadGuard, IsAuthorGuard)
  @UsePipes(ValidationPipe)
  @UseFilters(AllExceptionsFilter)
  update(@Param('id') id: string, @Body() dto: UpdateDreamDto) {
    return this.dreamsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dreamsService.remove(+id);
  }
}
