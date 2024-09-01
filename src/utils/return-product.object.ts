import { Prisma } from '@prisma/client';
import { returnCategoryObject } from './return-category.object';
import { returnReviewObject } from './return-review.object';

export const returnProductObject: Prisma.ProductSelect = {
  id: true,
  images: true,
  name: true,
  description: true,
  price: true,
  reviews: { select: returnReviewObject },
  category: { select: returnCategoryObject },
};
