import { IsOptional, IsString } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsString() //passed via query params
  page?: string;

  @IsOptional()
  @IsString() //passed via query params
  perPage?: string;
}
