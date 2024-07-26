import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StatisticsModule } from 'src/statistics/statistics.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [StatisticsModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
