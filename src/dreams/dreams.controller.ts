import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DreamsService } from './dreams.service';
import { CreateDreamDto } from './dto/create-dream.dto';
import { UpdateDreamDto } from './dto/update-dream.dto';

@Controller('dreams')
export class DreamsController {
  constructor(private readonly dreamsService: DreamsService) {}

  @Post()
  create(@Body() createDreamDto: CreateDreamDto) {
    return this.dreamsService.create(createDreamDto);
  }

  @Get()
  findAll() {
    return this.dreamsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dreamsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDreamDto: UpdateDreamDto) {
    return this.dreamsService.update(+id, updateDreamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dreamsService.remove(+id);
  }
}
