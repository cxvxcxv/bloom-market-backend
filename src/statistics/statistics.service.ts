import { Injectable } from '@nestjs/common';
import { IFullUser } from 'src/user/types';

@Injectable()
export class StatisticsService {
  constructor() {}

  async getMain(user: IFullUser) {
    return [
      {
        name: 'orders',
        value: user.orders.length,
      },
      {
        name: 'reviews',
        value: user.reviews.length,
      },
    ];
  }
}
