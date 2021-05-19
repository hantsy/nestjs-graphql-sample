import { registerAs } from '@nestjs/config';

export default registerAs('auth0', () => ({
  audience: process.env.AUTH0_AUDIENCE || 'https://hantsy.github.io/api',
  issuerUri:
    process.env.AUTH0_ISSUER_URI || 'https://dev-ese8241b.us.auth0.com/',
}));
