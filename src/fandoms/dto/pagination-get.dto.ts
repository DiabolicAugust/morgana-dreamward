import { Transform } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class PaginationGetDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) =>
    Number.isNaN(parseInt(value, 10)) ? 1 : parseInt(value, 10),
  )
  @Min(1)
  page: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) =>
    Number.isNaN(parseInt(value, 10)) ? 1 : parseInt(value, 10),
  )
  @Min(10)
  @Max(20)
  amount: number;
}
