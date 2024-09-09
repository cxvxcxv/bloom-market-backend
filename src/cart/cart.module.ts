import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductModule } from 'src/product/product.module';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  imports: [ProductModule],
  providers: [CartService, PrismaService],
  controllers: [CartController],
  exports: [CartService],
})
export class CartModule {}
