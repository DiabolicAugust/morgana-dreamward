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
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { GetPayloadGuard } from '../decorators/guards/get-payload.guard';
import { AllExceptionsFilter } from '../decorators/filters/errors.filter';
import { Payload } from '../authorization/dto/payload.dto';

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
  findAll() {
    return this.tagsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.update(+id, updateTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagsService.remove(+id);
  }
}
