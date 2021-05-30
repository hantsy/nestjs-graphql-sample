import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { GraphQLModule } from './graphql.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule, RouterModule, GraphQLModule],
  exports: [CommonModule, HttpClientModule, RouterModule, GraphQLModule],
})
export class CoreModule {
  // Prevent reimport of the CoreModule
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only'
      );
    }
  }
}
