import { Controller, Get, Param, Query, ValidationPipe } from '@nestjs/common';
import { FindAllProductsDto } from './dto/find-all-products.dto';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll(@Query(ValidationPipe) queryDto: FindAllProductsDto) {
    return this.productService.findAll(queryDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Get(':id/similar')
  findSimilar(@Param('id') id: string) {
    return this.productService.findSimilar(id);
  }

  @Get(':categoryId/by-category')
  findByCategory(@Param('categoryId') categoryId: string) {
    return this.productService.findByCategory(categoryId);
  }
}
