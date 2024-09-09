import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { Repository } from 'typeorm';
import { User } from '../person/user/entities/user.entity';
import { Strings } from '../data/strings';
import { Entities } from '../data/enums/strings.enum';
import { Role } from '../data/enums/role.enum';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag) private readonly tagsRepository: Repository<Tag>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateTagDto, userId: string) {
    const user = await this.getUser(userId);

    const tag = this.tagsRepository.create(dto);

    tag.author = user;
    tag.lastModifiedBy = user;
    if (user.role === Role.ADMIN) {
      tag.isApproved = true;
      tag.approvedBy = user;
    }

    const savedTag = await this.tagsRepository.save(tag);

    return instanceToPlain(savedTag);
  }

  findAll() {
    return `This action returns all tags`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tag`;
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return `This action updates a #${id} tag`;
  }

  remove(id: number) {
    return `This action removes a #${id} tag`;
  }

  private async getUser(userId: string): Promise<User> {
    //Get User
    const user = await this.userRepository.findOne({ where: { id: userId } });

    //Check User existance
    if (!user)
      throw new HttpException(
        Strings.entityWasNotFoundById(Entities.USER, userId),
        HttpStatus.BAD_REQUEST,
      );

    return user;
  }
}
