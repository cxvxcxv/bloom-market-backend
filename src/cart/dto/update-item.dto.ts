import { IsIn, IsNumber } from 'class-validator';

export class UpdateItemDto {
  @IsNumber()
  @IsIn([-1, 1])
  delta: number;
}
