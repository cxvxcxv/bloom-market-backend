import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';
import { CategoryModule } from './category/category.module';
import { OrderModule } from './order/order.module';
import { StatisticsModule } from './statistics/statistics.module';
import { PaginationModule } from './pagination/pagination.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ProductModule,
    ReviewModule,
    CategoryModule,
    OrderModule,
    StatisticsModule,
    PaginationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
