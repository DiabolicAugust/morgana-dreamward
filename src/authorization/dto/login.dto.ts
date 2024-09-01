import { IsOptional, IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { Strings } from '../../data/strings.js';
import { IsUsernameOrEmail } from '../validators/is-email-or-username.validator.js';

export abstract class LoginUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsUsernameOrEmail({
    message: Strings.loginDataValidation,
  })
  validateUsernameOrEmail: string;
}
