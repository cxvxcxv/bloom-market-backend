import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { Protect } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { CartService } from './cart.service';
import { CartItemDto } from './dto/cart-item.dto';
import { removeItemDto } from './dto/remove-item.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @Protect()
  async findProducts(@CurrentUser('id') userId: string) {
    return await this.cartService.findProducts(userId);
  }

  @Post()
  @Protect()
  async addItem(
    @CurrentUser('id') userId: string,
    @Body(ValidationPipe) cartItemDto: CartItemDto,
  ) {
    return await this.cartService.addItem(userId, cartItemDto);
  }

  @Delete()
  @Protect()
  async removeItem(@Body(ValidationPipe) removeItemDto: removeItemDto) {
    return await this.cartService.removeItem(removeItemDto);
  }
}
