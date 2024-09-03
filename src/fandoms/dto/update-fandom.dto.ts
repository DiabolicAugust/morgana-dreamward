import { PartialType } from '@nestjs/mapped-types';
import { CreateFandomDto } from './create-fandom.dto';

export class UpdateFandomDto extends PartialType(CreateFandomDto) {}
