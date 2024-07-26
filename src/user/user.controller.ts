import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { Protect } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { AuthUserDto } from 'src/auth/dto/auth-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Protect()
  getProfile(@CurrentUser('id') id: string) {
    return this.userService.getProfile(id);
  }

  @Put(':id')
  @Protect()
  update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body(ValidationPipe) authUserDto: AuthUserDto,
  ) {
    return this.userService.update(id, userId, authUserDto);
  }
}
