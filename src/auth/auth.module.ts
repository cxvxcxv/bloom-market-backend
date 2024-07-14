import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { options } from './config/jwt.config';
import { UserModule } from 'src/user/user.module';
import { STRATEGIES } from './strategies';
import { GUARDS } from './guards';

@Module({
  imports: [PassportModule, JwtModule.registerAsync(options()), UserModule],
  controllers: [AuthController],
  providers: [AuthService, ...STRATEGIES, ...GUARDS],
  // exports: [AuthService],
})
export class AuthModule {}
