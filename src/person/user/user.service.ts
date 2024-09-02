import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Strings } from '../../data/strings';
import { Entities } from '../../data/enums/strings.enum';
import { instanceToPlain } from 'class-transformer';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id: id },
      relations: ['emailVerification'],
    });
    if (!user)
      throw new HttpException(
        Strings.entityWasNotFoundById(Entities.USER, id),
        HttpStatus.BAD_REQUEST,
      );
    return instanceToPlain(user);
  }

  async update(id: string, dto: UpdateUserDto, file: Express.Multer.File) {
    const user = await this.findOne(id);
    Object.assign(user, dto);

    if (file) {
      user.avatar = process.env.FILES_ROOT + file.filename;
    }

    const savedUser = await this.userRepository.save(user);
    return instanceToPlain(savedUser);
  }

  async remove(id: string) {
    const user = await this.userRepository.findOneBy({ id: id });
    if (!user) {
      throw new HttpException(
        Strings.entityWasNotFoundById(Entities.USER, id),
        HttpStatus.BAD_REQUEST,
      );
    }

    const deletedUser = await this.userRepository.delete({ id: id });
    if (deletedUser.affected > 0)
      return {
        message: Strings.entityDeleted(Entities.USER),
      };
  }
}
