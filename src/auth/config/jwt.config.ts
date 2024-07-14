import { ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt';

const jwtModuleOptions = (configService: ConfigService): JwtModuleOptions => ({
  secret: configService.get('JWT_SECRET'),
  signOptions: {
    expiresIn: configService.get('JWT_EXP', '5m'), //sets to 5 min by default if no value in env
  },
});

export const options = (): JwtModuleAsyncOptions => ({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => jwtModuleOptions(configService),
});
