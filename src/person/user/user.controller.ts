import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Inject,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { UserUpdateGuard } from '../../decorators/guards/user-update.guard';
import { diskStorage } from 'multer';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(UserUpdateGuard)
  @UsePipes(ValidationPipe)
  @UseInterceptors(FilesInterceptor('avatar', 1))
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    // Initialize avatar as undefined
    let avatar: Express.Multer.File | undefined;

    // Check if a file was uploaded
    if (files && files.length > 0) {
      avatar = files[0];
    }
    return this.userService.update(id, updateUserDto, avatar);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
