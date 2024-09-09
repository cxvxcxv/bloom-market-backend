import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductService } from 'src/product/product.service';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class CartService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productService: ProductService,
  ) {}

  async findProducts(userId: string) {
    const cart = await this.prismaService.cart.findUnique({
      where: { userId },
    });

    return await this.prismaService.cartItem.findMany({
      where: { cartId: cart.id },
      include: { product: true },
    });
  }

  async createCart(userId: string) {
    const cart = await this.prismaService.cart.create({ data: { userId } });
    return cart;
  }

  async addItem(userId: string, productId: string) {
    //checks if cart exists
    const cart = await this.prismaService.cart.findUnique({
      where: { userId },
      include: { cartItems: true },
    });

    if (!cart) throw new NotFoundException('cart not found');

    //checks if product exists
    const product = await this.productService.findOne(productId);

    if (!product) throw new NotFoundException('product not found');

    //checks if item is already in cart
    const isItemInCart = cart.cartItems.some(
      item => item.productId === productId,
    );

    if (isItemInCart) throw new BadRequestException('item already in cart');

    return await this.prismaService.cartItem.create({
      data: { cartId: cart.id, productId },
    });
  }

  async updateItemQuantity(
    userId: string,
    cartItemId: string,
    updateItemDto: UpdateItemDto,
  ) {
    const { delta } = updateItemDto;

    const cartItem = await this.prismaService.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true },
    });

    if (!cartItem) throw new NotFoundException('cart item not found');
    if (cartItem.cart.userId !== userId)
      throw new ForbiddenException('no access');

    const newQuantity = Math.max(cartItem.quantity + delta, 0);

    return await this.prismaService.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: newQuantity },
    });
  }

  async deleteItem(userId: string, cartItemId: string) {
    const cartItem = await this.prismaService.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true },
    });

    if (!cartItem) throw new NotFoundException('cart item not found');
    if (cartItem.cart.userId !== userId)
      throw new ForbiddenException('no access');

    return await this.prismaService.cartItem.delete({
      where: { id: cartItemId },
    });
  }

  async clearCart() {
    return await this.prismaService.cart.deleteMany();
  }
}
