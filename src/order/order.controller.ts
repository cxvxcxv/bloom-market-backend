import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { Protect } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @Protect()
  findAll(@CurrentUser('id') userId: string) {
    return this.orderService.findAll(userId);
  }

  @Post()
  @Protect()
  createOrder(
    @Body(ValidationPipe) createOrderDto: CreateOrderDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.orderService.createOrder(createOrderDto, userId);
  }
}
