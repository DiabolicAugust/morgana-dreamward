import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EmailVerification } from './entities/email-verify.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../person/user/entities/user.entity';
import { instanceToPlain } from 'class-transformer';
import { Strings } from '../data/strings';
import { Entities } from '../data/enums/strings.enum';

@Injectable()
export class EmailVerifyService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(EmailVerification)
    private readonly emailVerificationRepository: Repository<EmailVerification>,
  ) {}

  async create(userId: string) {
    //Get User
    const user = await this.getUser(userId);

    //Set up EmailValidator
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60);
    const validator = this.emailVerificationRepository.create({
      user: user,
      expiresAt: expiresAt,
      email: user.email,
      token: this.generateVerificationToken(),
    });

    //Save EmailValidator
    const createdValidator =
      await this.emailVerificationRepository.save(validator);

    //TODO(morganawindy): Find some mailer to send mails

    console.log(instanceToPlain(createdValidator));
    return {
      message: Strings.tokenSent,
    };
  }

  // async findAll() {
  //   const emails = await this.emailVerificationRepository.find({
  //     relations: ['user'],
  //   });
  //   return instanceToPlain(emails[0]);
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} emailVerify`;
  // }

  async update(userId: string, token: string) {
    //Get User
    const user = await this.getUser(userId);

    //Get EmailVerification
    const emailVer = await this.emailVerificationRepository.findOneBy({
      id: user.emailVerification.id,
    });

    //Check EmailVerification existance
    if (!emailVer)
      throw new HttpException(
        Strings.entityWasNotFoundById(
          Entities.EMAILVERIFICATION,
          user.emailVerification.id,
        ),
        HttpStatus.BAD_REQUEST,
      );

    //Check if the token is the same
    if (emailVer.token != token)
      throw new HttpException(Strings.wrongToken, HttpStatus.BAD_REQUEST);

    //Update Verification
    emailVer.expiresAt = null;
    emailVer.token = null;
    emailVer.isUsed = true;

    const updated = await this.emailVerificationRepository.save(emailVer);

    //Check EmailVerification savement
    if (!updated)
      throw new HttpException(
        Strings.somethingWentWrong,
        HttpStatus.BAD_REQUEST,
      );
    return {
      message: Strings.successfulVerification,
    };
  }

  //TODO(morganawindy): Create email replacement
  remove(id: number) {
    return `This action removes a #${id} emailVerify`;
  }

  private generateVerificationToken(): string {
    return Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join(
      '',
    );
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
