import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTagDto, SearchTagDto, UpdateTagDto } from './dto/create-tag.dto';
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

  async findAll(dto: SearchTagDto): Promise<Tag[]> {
    const query = this.tagsRepository.createQueryBuilder('tag');

    // Add filter for title if provided
    if (dto.title) {
      query.andWhere('tag.title LIKE :title', { title: `%${dto.title}%` });
    }

    const tags = await query.getMany();
    return tags;
  }

  async findOne(id: string) {
    const tag = await this.getTag(id);
    return tag;
  }

  async update(id: string, dto: UpdateTagDto, userId: string) {
    const user = await this.getUser(userId);
    const tag = await this.getTag(id);

    tag.title = dto.title;
    tag.lastModifiedBy = user;

    const updatedTag = await this.tagsRepository.save(tag);

    return instanceToPlain(updatedTag);
  }

  async remove(id: string) {
    const tag = await this.getTag(id);
    const deletedTag = await this.tagsRepository.delete(tag.id);

    if (deletedTag.affected < 1)
      throw new HttpException(
        Strings.somethingWentWrong,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    return {
      message: Strings.entityDeleted(Entities.TAG),
    };
  }

  private async getUser(userId: string): Promise<User> {
    const start = Date.now();
    //Get User
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const userTime = Date.now();
    console.log(`user query took ${userTime - start}ms`);

    //Check User existance
    if (!user)
      throw new HttpException(
        Strings.entityWasNotFoundById(Entities.USER, userId),
        HttpStatus.BAD_REQUEST,
      );

    return user;
  }

  private async getTag(tagId: string): Promise<Tag> {
    //Get Tag
    const tag = await this.tagsRepository.findOne({
      where: { id: tagId },
      relations: ['author'],
    });

    //Check Tag existance
    if (!tag)
      throw new HttpException(
        Strings.entityWasNotFoundById(Entities.TAG, tagId),
        HttpStatus.BAD_REQUEST,
      );

    return tag;
  }
}
