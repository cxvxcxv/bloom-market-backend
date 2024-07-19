import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/pagination/dto/pagination.dto';

export enum EnumProductSort {
  HIGH_PRICE = 'high-price',
  LOW_PRICE = 'low-price',
}

export class FindAllProductsDto extends PaginationDto {
  @IsOptional()
  @IsEnum(EnumProductSort)
  sortBy?: EnumProductSort;

  @IsOptional()
  @IsString()
  searchTerm?: string;
}
