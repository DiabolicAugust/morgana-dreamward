import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFandomDto } from './dto/create-fandom.dto';
import { UpdateFandomDto } from './dto/update-fandom.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Fandom } from './entities/fandom.entity';
import { Repository } from 'typeorm';
import { Strings } from '../data/strings';
import { Payload } from '../authorization/dto/payload.dto';
import { User } from '../person/user/entities/user.entity';
import { Entities } from '../data/enums/strings.enum';
import { Role } from '../data/enums/role.enum';

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

    const fandom = this.fandomRepository.create({ ...dto, author: user });

    if (file) {
      fandom.avatar =
        process.env.FILES_ROOT + process.env.FILES_FANDOM + file.filename;
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

    return fandom;
  }

  findAll() {
    return `This action returns all fandoms`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fandom`;
  }

  update(id: number, updateFandomDto: UpdateFandomDto) {
    return `This action updates a #${id} fandom`;
  }

  remove(id: number) {
    return `This action removes a #${id} fandom`;
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
