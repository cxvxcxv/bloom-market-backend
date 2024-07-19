import { IsNumber, IsString } from 'class-validator';

export class OrderItemDto {
  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;

  @IsString() //better replace with IsUUID()
  productId: string;
}
