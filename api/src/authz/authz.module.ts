import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import auth0Config from '../config/auth0.config';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ConfigModule.forFeature(auth0Config),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [JwtStrategy],
  exports: [PassportModule],
})
export class AuthzModule {}
