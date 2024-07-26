import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { Protect } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(id);
  }

  @Get()
  findByProduct(@Query('productId') productId: string) {
    return this.reviewService.findByProduct(productId);
  }

  @Post(':productId')
  @Protect()
  create(
    @CurrentUser('id') id: string,
    @Param('productId') productId: string,
    @Body(ValidationPipe) createReviewDto: CreateReviewDto,
  ) {
    return this.reviewService.create(id, productId, createReviewDto);
  }

  @Delete(':id')
  @Protect()
  delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.reviewService.deleteOwnReview(id, userId);
  }
}
