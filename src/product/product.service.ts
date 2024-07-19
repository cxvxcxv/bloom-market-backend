import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationService } from 'src/pagination/pagination.service';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  returnFullProductObject,
  returnProductObject,
} from 'src/utils/return-product.object';
import {
  EnumProductSort,
  FindAllProductsDto,
} from './dto/find-all-products.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async findOne(id: string) {
    return await this.prismaService.product.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  async findAll(findAllProductsDto: FindAllProductsDto) {
    const { sortBy, searchTerm } = findAllProductsDto;
    const prismaSort: Prisma.ProductOrderByWithRelationInput[] = [];

    if (sortBy === EnumProductSort.LOW_PRICE) prismaSort.push({ price: 'asc' });
    else prismaSort.push({ price: 'desc' });

    const prismaSearchTermFilter: Prisma.ProductWhereInput = searchTerm
      ? {
          OR: [
            {
              category: { name: { contains: searchTerm, mode: 'insensitive' } },
            },
            {
              name: { contains: searchTerm, mode: 'insensitive' },
            },
            {
              description: { contains: searchTerm, mode: 'insensitive' },
            },
          ],
        }
      : {};

    const { skip, perPage } =
      this.paginationService.getPagination(findAllProductsDto);

    const products = await this.prismaService.product.findMany({
      where: prismaSearchTermFilter,
      orderBy: prismaSort,
      skip,
      take: perPage,
    });

    return {
      products,
      length: await this.prismaService.product.count({
        where: prismaSearchTermFilter,
      }),
    };
  }

  async findByCategory(categoryId: string) {
    const products = await this.prismaService.product.findMany({
      where: {
        category: { id: categoryId },
      },
      select: returnFullProductObject,
    });

    if (!products) throw new NotFoundException('products not found');
    return products;
  }

  async findSimilar(id: string) {
    const currentProduct = await this.findOne(id);
    if (!currentProduct)
      throw new NotFoundException('current product not found');

    const products = await this.prismaService.product.findMany({
      where: {
        category: { name: currentProduct.category.name },
        NOT: { id: currentProduct.id },
      },
      select: returnProductObject,
    });

    return products;
  }
}
