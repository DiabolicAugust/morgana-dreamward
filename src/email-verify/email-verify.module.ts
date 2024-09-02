import { Module } from '@nestjs/common';
import { EmailVerifyService } from './email-verify.service';
import { EmailVerifyController } from './email-verify.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailVerification } from './entities/email-verify.entity';
import { User } from '../person/user/entities/user.entity';

@Module({
  controllers: [EmailVerifyController],
  providers: [EmailVerifyService],
  imports: [TypeOrmModule.forFeature([User, EmailVerification])],
})
export class EmailVerifyModule {}
