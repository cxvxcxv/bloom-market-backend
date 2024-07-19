import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { returnCategoryObject } from 'src/utils/return-category.object';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async findOne(id: string) {
    const category = await this.prismaService.category.findUnique({
      where: { id },
      select: returnCategoryObject,
    });

    if (!category) throw new NotFoundException('category not found');

    return category;
  }

  async findAll() {
    return await this.prismaService.category.findMany({
      select: returnCategoryObject,
    });
  }
}
