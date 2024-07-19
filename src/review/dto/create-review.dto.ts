import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsOptional()
  @IsString()
  text?: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
}
