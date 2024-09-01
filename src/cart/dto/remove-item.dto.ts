import { IsBoolean, IsString } from 'class-validator';

export class removeItemDto {
  @IsBoolean()
  isDecrement: boolean;

  @IsString() //better replace with IsUUID()
  cartItemId: string;
}
