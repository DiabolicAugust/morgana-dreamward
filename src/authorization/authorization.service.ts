import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../person/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../person/user/dto/create-user.dto';
import { Strings } from '../data/strings';
import { EncryptionService } from '../services/encryption.service';
import { LoginUserDto } from './dto/login.dto';
import { Entities, Fields } from '../data/enums/strings.enum';
import { JwtService } from '@nestjs/jwt';
import { Payload } from './dto/payload.dto';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class AuthorizationService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly encryptionService: EncryptionService,
    private readonly jwtService: JwtService,
  ) {}

  async registration(dto: CreateUserDto) {
    const password = await this.encryptionService.hashPassword(dto.password);
    dto.password = password;
    const user = this.userRepository.create(dto);
    const savedUser = await this.userRepository.save(user);
    if (!savedUser)
      throw new HttpException(
        Strings.somethingWentWrong,
        HttpStatus.BAD_GATEWAY,
      );

    return instanceToPlain(savedUser);
  }

  async login(dto: LoginUserDto) {
    let user: User;

    if (dto.email) {
      user = await this.userRepository.findOneBy({ email: dto.email });
      if (!user)
        throw new HttpException(
          Strings.entityWasNotFoundByField(
            Entities.USER,
            Fields.EMAIL,
            dto.email,
          ),
          HttpStatus.BAD_REQUEST,
        );
    }

    if (dto.username) {
      user = await this.userRepository.findOneBy({ username: dto.username });
      if (!user)
        throw new HttpException(
          Strings.entityWasNotFoundByField(
            Entities.USER,
            Fields.USERNAME,
            dto.username,
          ),
          HttpStatus.BAD_REQUEST,
        );
    }

    const passwordCheck = await this.encryptionService.comparePassword(
      dto.password,
      user.password,
    );

    if (!passwordCheck)
      throw new HttpException(Strings.wrongPassword, HttpStatus.BAD_REQUEST);

    const payload: Payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
    const token = await this.jwtService.signAsync(payload);

    return {
      user: instanceToPlain(user),
      token: token,
    };
  }
}
