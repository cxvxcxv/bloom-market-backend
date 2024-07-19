import { Module } from '@nestjs/common';
import { PaginationModule } from 'src/pagination/pagination.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [PaginationModule],
  controllers: [ProductController],
  providers: [ProductService, PrismaService],
  exports: [ProductService],
})
export class ProductModule {}
