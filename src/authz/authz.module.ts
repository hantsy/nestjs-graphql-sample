import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { HasPermissionsGuard } from './has-permissions.guard';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [JwtStrategy, HasPermissionsGuard],
  exports: [PassportModule],
})
export class AuthzModule {}
