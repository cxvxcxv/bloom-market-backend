import { Controller, Get } from '@nestjs/common';
import { Protect } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  @Protect()
  getMain(@CurrentUser('id') id: string) {
    return this.statisticsService.getMain(id);
  }
}
