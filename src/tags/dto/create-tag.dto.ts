import { IsNotEmpty, IsString } from 'class-validator';
import { Strings } from '../../data/strings';
import { Fields } from '../../data/enums/strings.enum';
import { PartialType } from '@nestjs/mapped-types';

export class CreateTagDto {
  @IsNotEmpty({ message: Strings.fieldCantBeEmpty(Fields.TITLE) })
  @IsString({ message: Strings.fieldMustBeString(Fields.TITLE) })
  title: string;
}

// Using PartialType to create UpdateTagDto
export class UpdateTagDto extends PartialType(CreateTagDto) {}
