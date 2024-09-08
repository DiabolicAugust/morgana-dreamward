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
  Query,
} from '@nestjs/common';
import { FandomsService } from './fandoms.service';
import { CreateFandomDto } from './dto/create-fandom.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AllExceptionsFilter } from '../decorators/filters/errors.filter';
import { GetPayloadGuard } from '../decorators/guards/get-payload.guard';
import { Payload } from '../authorization/dto/payload.dto';
import { CheckAdminRoleGuard } from '../decorators/guards/check-admin-role.guard';
import { PaginationGetDto } from './dto/pagination-get.dto';
import { FileCleanupInterceptor } from '../decorators/file-cleanup.interceptor';

@Controller('fandoms')
export class FandomsController {
  constructor(private readonly fandomsService: FandomsService) {}

  @Post()
  @UseGuards(GetPayloadGuard)
  @UseFilters(AllExceptionsFilter)
  @UsePipes(ValidationPipe)
  @UseInterceptors(FilesInterceptor('avatar', 1), FileCleanupInterceptor)
  create(
    @Body() createFandomDto: CreateFandomDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req: Request,
  ) {
    const author: Payload = req['user'];

    // Initialize an avatar as undefined
    let avatar: Express.Multer.File | undefined = getAvatar(files);
    return this.fandomsService.create(createFandomDto, avatar, author.id);
  }

  @Get()
  // @UseGuards(GetPayloadGuard)
  @UseFilters(AllExceptionsFilter)
  @UsePipes(new ValidationPipe({ transform: true }))
  get(@Query() dto: PaginationGetDto, @Request() req: Request) {
    // const user: Payload = req['user'];
    return this.fandomsService.findAll(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fandomsService.findOne(+id);
  }

  @Patch('/approve/:id')
  @UseGuards(CheckAdminRoleGuard)
  approve(@Param('id') id: string, @Request() req: Request) {
    const user: Payload = req['user'];

    return this.fandomsService.approveFandom(id, user.id);
  }

  @Patch(':id')
  @UseGuards(CheckAdminRoleGuard)
  @UsePipes(ValidationPipe)
  @UseInterceptors(FilesInterceptor('avatar', 1), FileCleanupInterceptor)
  update(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('id') id: string,
    @Body() dto: CreateFandomDto,
    @Request() req: Request,
  ) {
    // Initialize an avatar as undefined
    let avatar: Express.Multer.File | undefined = getAvatar(files);
    return this.fandomsService.update(id, dto, req['user'].id, avatar);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fandomsService.remove(id);
  }
}

function getAvatar(files: Express.Multer.File[]) {
  let avatar: Express.Multer.File | undefined;

  // Check if the avatar was uploaded
  if (files && files.length > 0) {
    avatar = files[0];
  }
  return avatar;
}
