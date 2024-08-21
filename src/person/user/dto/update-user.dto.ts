import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsDateString()
  dateOfBirth: Date;

  @IsNotEmpty()
  @IsString()
  about: string;
}
