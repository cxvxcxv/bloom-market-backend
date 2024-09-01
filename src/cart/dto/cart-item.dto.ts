import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CartItemDto {
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsString() //better replace with isUUID()
  productId: string;
}
