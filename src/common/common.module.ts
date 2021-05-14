import { Module } from '@nestjs/common';

import { LoggingPlugin } from './plugins/logging.plugin';

@Module({
  providers: [
    // DateScalar
    LoggingPlugin,
    //ComplexityPlugin,
  ],
})
export class CommonModule {}
