import { EnumOrderStatus } from '@prisma/client';
import { ArrayMinSize, IsEnum, IsOptional } from 'class-validator';
import { OrderItemDto } from './order-item.dto';

export class CreateOrderDto {
  @IsOptional()
  @IsEnum(EnumOrderStatus)
  status?: EnumOrderStatus;

  @ArrayMinSize(1)
  items: OrderItemDto[];
}
