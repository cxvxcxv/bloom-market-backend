import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { Protect } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { CartService } from './cart.service';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @Protect()
  async findProducts(@CurrentUser('id') userId: string) {
    return await this.cartService.findProducts(userId);
  }

  @Post(':productId')
  @Protect()
  async addItem(
    @CurrentUser('id') userId: string,
    @Param('productId') productId: string,
  ) {
    return await this.cartService.addItem(userId, productId);
  }

  @Patch(':cartItemId')
  @Protect()
  async updateItemQuantity(
    @CurrentUser('id') userId: string,
    @Param('cartItemId') cartItemId: string,
    @Body(ValidationPipe) updateItemDto: UpdateItemDto,
  ) {
    return await this.cartService.updateItemQuantity(
      userId,
      cartItemId,
      updateItemDto,
    );
  }

  @Delete(':cartItemId')
  @Protect()
  async removeItem(
    @CurrentUser('id') userId: string,
    @Param('cartItemId') cartItemId: string,
  ) {
    return await this.cartService.deleteItem(userId, cartItemId);
  }
}
