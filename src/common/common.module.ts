import { Module } from '@nestjs/common';
import { ComplexityPlugin } from './complexity.plugin';
import { DateScalar } from './date.scalar';
import { LoggingPlugin } from './logging.plugin';

@Module({
  providers: [
    // DateScalar
    LoggingPlugin,
    ComplexityPlugin,
  ],
})
export class CommonModule {}
