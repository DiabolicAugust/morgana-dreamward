import { Module } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { AuthorizationController } from './authorization.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../person/user/entities/user.entity';
import { EncryptionService } from '../services/encryption.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [AuthorizationController],
  providers: [AuthorizationService, EncryptionService],
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {},
    }),
  ],
})
export class AuthorizationModule {}
