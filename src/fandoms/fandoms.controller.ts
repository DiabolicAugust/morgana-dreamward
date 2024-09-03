import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  UseFilters,
  UsePipes,
  ValidationPipe,
  Request,
} from '@nestjs/common';
import { FandomsService } from './fandoms.service';
import { CreateFandomDto } from './dto/create-fandom.dto';
import { UpdateFandomDto } from './dto/update-fandom.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AllExceptionsFilter } from '../decorators/filters/errors.filter';
import { GetPayloadGuard } from '../decorators/guards/get-payload.guard';
import { Payload } from '../authorization/dto/payload.dto';

@Controller('fandoms')
export class FandomsController {
  constructor(private readonly fandomsService: FandomsService) {}

  @Post()
  @UseGuards(GetPayloadGuard)
  @UseFilters(AllExceptionsFilter)
  @UsePipes(ValidationPipe)
  @UseInterceptors(FilesInterceptor('avatar', 1))
  create(
    @Body() createFandomDto: CreateFandomDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req: Request,
  ) {
    const author: Payload = req['user'];

    // Initialize an avatar as undefined
    let avatar: Express.Multer.File | undefined;

    // Check if the avatar was uploaded
    if (files && files.length > 0) {
      avatar = files[0];
    }
    return this.fandomsService.create(createFandomDto, avatar, author.id);
  }

  @Get()
  findAll() {
    return this.fandomsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fandomsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFandomDto: UpdateFandomDto) {
    return this.fandomsService.update(+id, updateFandomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fandomsService.remove(+id);
  }
}
