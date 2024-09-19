import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Strings } from '../../data/strings';
import { Fields } from '../../data/enums/strings.enum';
import { PartialType } from '@nestjs/mapped-types';

export class CreateFragmentDto {
  @IsNotEmpty({ message: Strings.fieldCantBeEmpty(Fields.TEXT) })
  @IsString({ message: Strings.fieldMustBeString(Fields.TEXT) })
  text: string;

  // @IsNotEmpty({ message: Strings.fieldCantBeEmpty(Fields.RELATED_DREAM) })
  // @IsString({ message: Strings.fieldMustBeString(Fields.RELATED_DREAM) })
  // relatedDream: string;

  @IsOptional()
  @IsNotEmpty({ message: Strings.fieldCantBeEmpty(Fields.EPIGRAPH) })
  @IsString({ message: Strings.fieldMustBeString(Fields.EPIGRAPH) })
  epigraph: string;

  @IsNotEmpty({ message: Strings.fieldCantBeEmpty(Fields.TITLE) })
  @IsString({ message: Strings.fieldMustBeString(Fields.TITLE) })
  title: string;

  @IsOptional()
  @IsNotEmpty({ message: Strings.fieldCantBeEmpty(Fields.CONTENT_NUMBER) })
  @IsInt({ message: Strings.fieldMustBeInt(Fields.CONTENT_NUMBER) })
  contentNumber: number;
}

// Using PartialType to create UpdateTagDto
export class UpdateFragmentDto extends PartialType(CreateFragmentDto) {}
