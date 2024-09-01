import { PartialType } from '@nestjs/mapped-types';
import {
  isEmail,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Strings } from '../../../data/strings';
import { Fields } from '../../../data/enums/strings.enum';

export class CreateUserDto {
  @IsEmail({}, { message: Strings.fieldMustBeEmail(Fields.EMAIL) })
  email: string;

  @IsNotEmpty({ message: Strings.fieldCantBeEmpty(Fields.USERNAME) })
  @IsString({ message: Strings.fieldMustBeString(Fields.USERNAME) })
  @MinLength(3, { message: Strings.fieldTooShort(Fields.USERNAME, 3) })
  @MaxLength(20, { message: Strings.fieldTooLong(Fields.USERNAME, 20) })
  username: string;

  @IsNotEmpty({ message: Strings.fieldCantBeEmpty(Fields.PASSWORD) })
  @IsString({ message: Strings.fieldMustBeString(Fields.USERNAME) })
  @MinLength(7, { message: Strings.fieldTooShort(Fields.PASSWORD, 7) })
  @MaxLength(20, { message: Strings.fieldTooLong(Fields.PASSWORD, 20) })
  password: string;
}
