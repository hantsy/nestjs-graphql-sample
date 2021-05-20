// src/authz/jwt.strategy.ts

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import auth0Config from '../config/auth0.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(auth0Config.KEY) config: ConfigType<typeof auth0Config>) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${config.issuerUri}.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: config.audience,
      issuer: config.issuerUri,
      algorithms: ['RS256'],
    });
  }

  validate(payload: any): any {
    console.log('jwt payload:', JSON.stringify(payload));
    return payload;
  }
}
