import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { StatisticsService } from 'src/statistics/statistics.service';
import { AuthUserDto } from './../auth/dto/auth-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly statisticsService: StatisticsService,
  ) {}

  async findOne(idOrEmail: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [{ id: idOrEmail }, { email: idOrEmail }],
      },
      include: {
        orders: true,
        reviews: true,
      },
    });

    return user;
  }

  async getProfile(id: string) {
    const profile = await this.findOne(id);
    if (!profile) throw new NotFoundException('profile not found');

    const statistics = await this.statisticsService.getMain(profile);

    return { profile, statistics };
  }

  async create(authUserDto: AuthUserDto) {
    const user = await this.findOne(authUserDto.email);
    if (user) throw new BadRequestException('user already exists');

    const hashedPassword = await hash(authUserDto.password);

    return await this.prismaService.user.create({
      data: {
        email: authUserDto.email,
        password: hashedPassword,
      },
    });
  }

  async update(paramId: string, userId: string, authUserDto: AuthUserDto) {
    if (paramId !== userId) throw new ForbiddenException('no access');

    const user = await this.findOne(authUserDto.email);
    if (user) throw new BadRequestException('user with such email exists');

    const hashedPassword = await hash(authUserDto.password);

    return await this.prismaService.user.update({
      where: { id: userId },
      data: {
        email: authUserDto.email,
        password: hashedPassword,
      },
    });
  }
}
