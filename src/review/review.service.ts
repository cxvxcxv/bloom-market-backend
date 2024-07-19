import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductService } from 'src/product/product.service';
import { returnReviewObject } from 'src/utils/return-review.object';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productService: ProductService,
  ) {}

  async findOne(id: string) {
    const review = await this.prismaService.review.findUnique({
      where: { id },
    });

    if (!review) throw new NotFoundException('review not found');

    return review;
  }

  async findByProduct(productId: string) {
    return await this.prismaService.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      select: returnReviewObject,
    });
  }

  async create(
    userId: string,
    productId: string,
    createReviewDto: CreateReviewDto,
  ) {
    //checks if product with such id exists
    const product = await this.productService.findOne(productId);
    if (!product) throw new NotFoundException('product does not exist');

    return await this.prismaService.review.create({
      data: {
        ...createReviewDto,
        product: { connect: { id: productId } },
        user: { connect: { id: userId } },
      },
    });
  }

  async getAverageRating(productId: string) {
    return await this.prismaService.review
      .aggregate({
        where: { productId },
        _avg: { rating: true },
      })
      .then(data => data._avg);
  }

  async deleteOwnReview(id: string, userId: string) {
    const review = await this.findOne(id);
    if (review.userId !== userId) throw new ForbiddenException('no access');

    return await this.prismaService.review.delete({
      where: { id },
    });
  }
}
