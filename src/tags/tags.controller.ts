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
import { TagsService } from './tags.service';
import { CreateTagDto, SearchTagDto, UpdateTagDto } from './dto/create-tag.dto';
import { GetPayloadGuard } from '../decorators/guards/get-payload.guard';
import { AllExceptionsFilter } from '../decorators/filters/errors.filter';
import { Payload } from '../authorization/dto/payload.dto';
import { CheckAdminRoleGuard } from '../decorators/guards/check-admin-role.guard';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @UseGuards(GetPayloadGuard)
  @UsePipes(ValidationPipe)
  @UseFilters(AllExceptionsFilter)
  @Post()
  create(@Body() dto: CreateTagDto, @Request() req: Request) {
    const user: Payload = req['user'];
    return this.tagsService.create(dto, user.id);
  }

  @Get()
  @UseFilters(AllExceptionsFilter)
  findAll(@Query() dto: SearchTagDto) {
    return this.tagsService.findAll(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(CheckAdminRoleGuard)
  @UsePipes(ValidationPipe)
  @UseFilters(AllExceptionsFilter)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTagDto,
    @Request() req: Request,
  ) {
    const user: Payload = req['user'];
    return this.tagsService.update(id, dto, user.id);
  }

  @Delete(':id')
  @UseGuards(CheckAdminRoleGuard)
  @UseFilters(AllExceptionsFilter)
  remove(@Param('id') id: string) {
    return this.tagsService.remove(id);
  }
}
