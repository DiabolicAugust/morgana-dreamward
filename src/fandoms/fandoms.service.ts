import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFandomDto } from './dto/create-fandom.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Fandom } from './entities/fandom.entity';
import { Repository } from 'typeorm';
import { Strings } from '../data/strings';
import { Payload } from '../authorization/dto/payload.dto';
import { User } from '../person/user/entities/user.entity';
import { Entities } from '../data/enums/strings.enum';
import { Role } from '../data/enums/role.enum';
import { PaginationGetDto } from './dto/pagination-get.dto';
import { instanceToPlain } from 'class-transformer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FandomsService {
  constructor(
    @InjectRepository(Fandom)
    private readonly fandomRepository: Repository<Fandom>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    dto: CreateFandomDto,
    file: Express.Multer.File,
    userId: string,
  ) {
    const user = await this.getUser(userId);

    const fandom = this.fandomRepository.create({
      ...dto,
      author: user,
      lastModifiedBy: user,
    });

    if (file) {
      fandom.avatar = process.env.FILES_ROOT + file.filename;
    }

    if (user.role === Role.ADMIN) {
      fandom.approvedBy = user;
      fandom.isApproved = true;
    }

    const savedFandom = await this.fandomRepository.save(fandom);

    if (!savedFandom)
      throw new HttpException(
        Strings.somethingWentWrong,
        HttpStatus.BAD_GATEWAY,
      );

    return instanceToPlain(fandom);
  }

  async findAll(dto: PaginationGetDto) {
    const skip = (dto.page - 1) * dto.amount;

    // const where = userRole === Role.ADMIN ? {} : { isApproved: true };

    const [data, count] = await this.fandomRepository.findAndCount({
      //TODO(morgana): Enabler after test
      // where: { isApproved: true },
      skip: skip,
      take: dto.amount,
      relations: ['author', 'lastModifiedBy'],
    });

    const pagesAmount = Math.ceil(count / dto.amount);
    const morePages = pagesAmount > dto.page;

    return instanceToPlain({
      fandoms: data,
      count: count,
      page: dto.page,
      amount: dto.amount,
      more: morePages,
      pages: pagesAmount,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} fandom`;
  }

  async update(
    id: string,
    dto: CreateFandomDto,
    userId: string,
    avatar: Express.Multer.File | undefined,
  ) {
    const user = await this.getUser(userId);

    const fandom = await this.getFandom(id);

    if (avatar) {
      if (fandom.avatar) {
        const oldAvatarPath = path.join(process.cwd(), fandom.avatar);
        console.log(oldAvatarPath);
        if (fs.existsSync(oldAvatarPath)) {
          fs.unlinkSync(oldAvatarPath);
          console.log('old picture deleted!');
        }
      }
      fandom.avatar = process.env.FILES_ROOT + avatar.filename;
    }

    fandom.title = dto.title;
    fandom.lastModifiedBy = user;

    const updatedFandom = this.fandomRepository.save(fandom);

    return instanceToPlain(updatedFandom);
  }

  async approveFandom(id: string, userId: string) {
    const user = await this.getUser(userId);

    const fandom = await this.getFandom(id);

    if (fandom.isApproved === true)
      throw new HttpException(
        Strings.entityAlreadyApproved(Entities.FANDOM),
        HttpStatus.NOT_ACCEPTABLE,
      );

    fandom.isApproved = true;
    fandom.approvedBy = user;
    fandom.lastModifiedBy = user;

    const updatedFandom = this.fandomRepository.save(fandom);

    return updatedFandom;
  }

  async remove(id: string) {
    const fandom = await this.fandomRepository.delete({ id: id });
    if (fandom.affected < 1)
      throw new HttpException(
        Strings.somethingWentWrong,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: Strings.entityDeleted(Entities.FANDOM),
    };
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
    const fandom = await this.fandomRepository.findOne({
      where: { id: fandomId },
    });

    //Check Fandom existance
    if (!fandom)
      throw new HttpException(
        Strings.entityWasNotFoundById(Entities.FANDOM, fandomId),
        HttpStatus.BAD_REQUEST,
      );

    return fandom;
  }
}
