import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { HomeContentComponent } from './home-content/home-content.component';
import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';

@NgModule({
  declarations: [HomeComponent, HomeContentComponent],
  imports: [SharedModule, HomeRoutingModule],
})
export class HomeModule {}
