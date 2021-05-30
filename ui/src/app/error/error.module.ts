import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ErrorRoutingModule } from './error-routing.module';
import { ErrorComponent } from './error.component';

@NgModule({
  declarations: [ErrorComponent],
  imports: [SharedModule, ErrorRoutingModule],
})
export class ErrorModule {}
