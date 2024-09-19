import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Strings } from '../../data/strings';
import { Fields } from '../../data/enums/strings.enum';
import { Type } from 'class-transformer';

export class UpdateOrderDto {
  @IsArray({ message: Strings.fieldMustBeArray(Fields.ORDER) })
  @ArrayNotEmpty({ message: Strings.fieldCantBeEmpty(Fields.ORDER) })
  @ValidateNested({ each: true })
  @Type(() => UpdateOrderType)
  order: UpdateOrderType[];
}

export class UpdateOrderType {
  @IsString({ message: Strings.fieldMustBeString(Fields.ID) })
  @IsNotEmpty({ message: Strings.fieldCantBeEmpty(Fields.ID) })
  id: string;

  @IsInt({ message: Strings.fieldMustBeInt(Fields.CONTENT_NUMBER) })
  contentNumber: number;
}
