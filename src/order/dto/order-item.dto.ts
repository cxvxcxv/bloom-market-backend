import { IsNumber, IsOptional, IsString } from 'class-validator';

export class OrderItemDto {
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsNumber()
  price: number;

  @IsString() //better replace with IsUUID()
  productId: string;
}
