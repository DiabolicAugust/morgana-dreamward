import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Strings } from '../../data/strings';
import { Fields } from '../../data/enums/strings.enum';

export class CreateFandomDto {
  //TODO(morgana): recreate updatedto with PartialType, cause current varient can lead to error on create endpoint
  @IsOptional()
  @IsNotEmpty({ message: Strings.fieldCantBeEmpty(Fields.TITLE) })
  @IsString({ message: Strings.fieldMustBeString(Fields.TITLE) })
  title: string;
}
