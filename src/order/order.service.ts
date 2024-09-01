import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { returnProductObject } from 'src/utils/return-product.object';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(userId: string) {
    return await this.prismaService.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        orderItems: { include: { product: { select: returnProductObject } } },
      },
    });
  }

  async createOrder(createOrderDto: CreateOrderDto, userId: string) {
    const totalPrice = createOrderDto.items.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

    const order = await this.prismaService.order.create({
      data: {
        status: createOrderDto.status,
        totalPrice,
        orderItems: { create: createOrderDto.items },
        user: { connect: { id: userId } },
      },
    });

    return order;
  }
}
