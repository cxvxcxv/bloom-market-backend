import { Order, Review, User } from '@prisma/client';

export interface IFullUser extends User {
  orders: Order[];
  reviews: Review[];
}
