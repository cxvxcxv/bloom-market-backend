import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class StatisticsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  async getMain(userId: string) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new NotFoundException('user not found');

    return [
      {
        name: 'orders',
        value: user.orders.length,
      },
      {
        name: 'reviews',
        value: user.reviews.length,
      },
    ];
  }
}
