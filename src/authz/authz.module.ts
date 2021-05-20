import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { HasPermissionsGuard } from './has-permissions.guard';
import { ConfigModule } from '@nestjs/config';
import auth0Config from '../config/auth0.config';

@Module({
  imports: [
    ConfigModule.forFeature(auth0Config),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [JwtStrategy, HasPermissionsGuard],
  exports: [PassportModule],
})
export class AuthzModule {}
