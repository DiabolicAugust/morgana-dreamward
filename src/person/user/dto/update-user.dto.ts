import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Fields } from '../../../data/enums/strings.enum';
import { Strings } from '../../../data/strings';

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty({ message: Strings.fieldCantBeEmpty(Fields.USERNAME) })
  @IsString({ message: Strings.fieldMustBeString(Fields.USERNAME) })
  @MinLength(3, { message: Strings.fieldTooShort(Fields.USERNAME, 3) })
  @MaxLength(20, { message: Strings.fieldTooLong(Fields.USERNAME, 20) })
  username: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth: Date;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  about: string;
}
