import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartItemDto } from './dto/cart-item.dto';

@Injectable()
export class CartService {
  constructor(private readonly prismaService: PrismaService) {}

  async findProducts(userId: string) {
    const cart = await this.prismaService.cart.findUnique({
      where: { userId },
    });

    return await this.prismaService.cartItem.findMany({
      where: { cartId: cart.id },
    });
  }

  async addItem(userId: string, cartItemDto: CartItemDto) {
    let cart = await this.prismaService.cart.findUnique({
      where: { userId },
      include: { cartItems: true },
    });

    if (!cart) {
      cart = await this.prismaService.cart.create({
        data: {
          userId,
          cartItems: {
            create: [
              {
                productId: cartItemDto.productId,
                quantity: cartItemDto.quantity ?? 1,
              },
            ],
          },
        },
        include: { cartItems: true },
      });
    } else {
      const existingCartItem = cart.cartItems.find(
        item => item.productId === cartItemDto.productId,
      );

      if (existingCartItem) {
        await this.prismaService.cartItem.update({
          where: { id: existingCartItem.id },
          data: { quantity: existingCartItem.quantity + cartItemDto.quantity },
        });
      } else {
        await this.prismaService.cartItem.create({
          data: {
            cartId: cart.id,
            productId: cartItemDto.productId,
            quantity: cartItemDto.quantity,
          },
        });
      }
    }

    return await this.prismaService.cart.findUnique({
      where: { userId },
      include: { cartItems: true },
    });
  }

  async removeItem(removeItemDto) {
    const cartItem = await this.prismaService.cartItem.findUnique({
      where: { id: removeItemDto.cartItemId },
    });

    if (!cartItem) throw new NotFoundException('cart item not found');

    if (removeItemDto.isDecrement) {
      return await this.prismaService.cartItem.update({
        where: { id: removeItemDto.cartItemId },
        data: { quantity: cartItem.quantity - 1 },
      });
    } else {
      return await this.prismaService.cartItem.delete({
        where: { id: removeItemDto.cartItemId },
      });
    }
  }

  async clearCart() {
    return await this.prismaService.cart.deleteMany();
  }
}
