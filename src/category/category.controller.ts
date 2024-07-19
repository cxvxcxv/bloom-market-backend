import { Controller, Get, Param } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Get()
  getAll() {
    return this.categoryService.findAll();
  }
}
