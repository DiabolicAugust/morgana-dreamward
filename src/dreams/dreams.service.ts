import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDreamDto, UpdateDreamDto } from './dto/create-dream.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Dream } from './entities/dream.entity';
import { In, Repository } from 'typeorm';
import { User } from '../person/user/entities/user.entity';
import { Tag } from '../tags/entities/tag.entity';
import { Fandom } from '../fandoms/entities/fandom.entity';
import { Strings } from '../data/strings';
import { Entities } from '../data/enums/strings.enum';
import { instanceToPlain } from 'class-transformer';
import { PaginationGetDto } from '../fandoms/dto/pagination-get.dto';
import { PaginationType } from '../data/pagination.type';
import { ParentServiceClass } from '../data/service-parent.class';

@Injectable()
export class DreamsService extends ParentServiceClass<Dream> {
  constructor(
    @InjectRepository(Dream)
    private readonly dreamRepository: Repository<Dream>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Fandom)
    private readonly fandomRepository: Repository<Fandom>,
  ) {
    super();
  }

  async create(dto: CreateDreamDto, userId: string) {
    const users: User[] = [];
    const user = await this.getUser(userId);
    users.push(user);

    if (dto.secondAuthor) {
      const secondAuthor = await this.getUser(dto.secondAuthor);
      users.push(secondAuthor);
    }

    let fandom: Fandom;
    let tags: Tag[];

    if (dto.fandom) {
      fandom = await this.getFandom(dto.fandom);
    }

    if (dto.tags.length > 0) {
      tags = await this.getTags(dto.tags);
    }

    const dream = this.dreamRepository.create({
      ...dto,
      author: users,
      tags: tags,
      fandom: fandom,
    });

    const savedDream = await this.dreamRepository.save(dream);

    return instanceToPlain(savedDream);
  }

  async findAll(dto: PaginationGetDto) {
    const skip = (dto.page - 1) * dto.amount;

    // const where = userRole === Role.ADMIN ? {} : { isApproved: true };

    const [data, count] = await this.dreamRepository.findAndCount({
      //TODO(morgana): Enabler after test
      // where: { isApproved: true },
      skip: skip,
      take: dto.amount,
      relations: ['author'],
    });

    const pagesAmount = Math.ceil(count / dto.amount);
    const morePages = pagesAmount > dto.page;

    const result: PaginationType<Dream> = {
      data: data,
      count: count,
      page: dto.page,
      amount: dto.amount,
      more: morePages,
      pages: pagesAmount,
    };

    return instanceToPlain(result);
  }

  async get(id: string): Promise<Dream> {
    const dream = await this.getDream(id);
    return dream;
  }

  async update(id: string, dto: UpdateDreamDto) {
    console.log(dto);
    const dream = await this.getDream(id);

    Object.assign(dream, dto);

    const savedDream = await this.dreamRepository.save(dream);
    return instanceToPlain(savedDream);
  }

  remove(id: number) {
    return `This action removes a #${id} dream`;
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

  private async getFandom(fandomId: string): Promise<Fandom> {
    //Get Fandom
    const fandom = await this.fandomRepository.findOneBy({
      id: fandomId,
      isApproved: true,
    });
    if (!fandom)
      throw new HttpException(
        Strings.entityWasNotFoundById(Entities.FANDOM, fandomId),
        HttpStatus.BAD_REQUEST,
      );
    return fandom;
  }

  private async getDream(dreamId: string): Promise<Dream> {
    //Get Dream
    const dream = await this.dreamRepository.findOne({
      where: {
        id: dreamId,
      },
      relations: ['author'],
    });
    if (!dream)
      throw new HttpException(
        Strings.entityWasNotFoundById(Entities.DREAM, dreamId),
        HttpStatus.BAD_REQUEST,
      );
    return dream;
  }

  private async getTags(tagIds: string[]): Promise<Tag[]> {
    // Fetch Tags by their IDs
    const tags = await this.tagRepository.findBy({
      id: In(tagIds),
      isApproved: true,
    });

    if (!tags || tags.length === 0) {
      throw new HttpException(
        Strings.entityWasNotFoundById(Entities.TAG, tagIds.join(', ')),
        HttpStatus.BAD_REQUEST,
      );
    }

    return tags;
  }
}
