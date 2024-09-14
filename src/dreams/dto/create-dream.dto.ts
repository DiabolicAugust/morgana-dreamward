import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Strings } from '../../data/strings';
import { Fields } from '../../data/enums/strings.enum';
import { Status } from '../../data/enums/dreams/dream-status.enum';
import { MatureRatring } from '../../data/enums/dreams/dream-mature-rating.enum';
import { PartialType } from '@nestjs/mapped-types';

export class CreateDreamDto {
  @IsNotEmpty({ message: Strings.fieldCantBeEmpty(Fields.TITLE) })
  @IsString({ message: Strings.fieldMustBeString(Fields.TITLE) })
  title: string;

  @IsOptional()
  @IsNotEmpty({ message: Strings.fieldCantBeEmpty(Fields.DESCRIPTION) })
  @IsString({ message: Strings.fieldMustBeString(Fields.DESCRIPTION) })
  description: string;

  @IsOptional()
  @IsNotEmpty({ message: Strings.fieldCantBeEmpty(Fields.SECOND_AUTHOR) })
  @IsString({ message: Strings.fieldMustBeString(Fields.SECOND_AUTHOR) })
  secondAuthor: string;

  @IsOptional()
  @IsNotEmpty({ message: Strings.fieldCantBeEmpty(Fields.STATUS) })
  @IsEnum(Status, {
    message: Strings.fieldMustBeOneOfEnum(Fields.STATUS, Status),
  })
  status: Status;

  @IsOptional()
  @IsNotEmpty({ message: Strings.fieldCantBeEmpty(Fields.MATURE_RATING) })
  @IsEnum(MatureRatring, {
    message: Strings.fieldMustBeOneOfEnum(Fields.MATURE_RATING, MatureRatring),
  })
  matureRating: MatureRatring;

  @IsOptional()
  @IsNotEmpty({ message: Strings.fieldCantBeEmpty(Fields.BOOK_NUMBER) })
  @IsInt({
    message: Strings.fieldMustBeString(Fields.BOOK_NUMBER),
  })
  bookNumber: number;

  @IsNotEmpty({ message: Strings.fieldCantBeEmpty(Fields.FANDOM) })
  @IsString({ message: Strings.fieldMustBeString(Fields.FANDOM) })
  fandom: string;

  @IsArray({ message: Strings.fieldMustBeArray(Fields.TAGS) })
  @ArrayNotEmpty({ message: Strings.fieldCantBeEmpty(Fields.TAGS) })
  @IsString({
    each: true,
    message: Strings.fieldAllElementsMustBeString(Fields.TAGS),
  })
  @IsNotEmpty({
    each: true,
    message: Strings.fieldAllElementsCantBeEmpty(Fields.TAGS),
  })
  tags: string[];
}

// Using PartialType to create UpdateTagDto
export class UpdateDreamDto extends PartialType(CreateDreamDto) {}
