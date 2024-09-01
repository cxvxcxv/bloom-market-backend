import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  providers: [CartService, PrismaService],
  controllers: [CartController],
})
export class CartModule {}
