import { IsNotEmpty, IsString } from 'class-validator';
import { Strings } from '../../data/strings';
import { Fields } from '../../data/enums/strings.enum';

export class CreateFandomDto {
  @IsNotEmpty({ message: Strings.fieldCantBeEmpty(Fields.TITLE) })
  @IsString({ message: Strings.fieldMustBeString(Fields.TITLE) })
  title: string;
}
