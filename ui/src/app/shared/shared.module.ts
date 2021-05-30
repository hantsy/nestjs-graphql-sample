import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginButtonComponent } from './components/login-button/login-button.component';
import { SignupButtonComponent } from './components/signup-button/signup-button.component';
import { AuthNavComponent } from './components/auth-nav/auth-nav.component';
import { AuthenticationButtonComponent } from './components/authentication-button/authentication-button.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoadingComponent } from './components/loading/loading.component';
import { LogoutButtonComponent } from './components/logout-button/logout-button.component';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';

const COMPONENTS: any[] = [
  LoginButtonComponent,
  SignupButtonComponent,
  LogoutButtonComponent,
  AuthenticationButtonComponent,
  AuthNavComponent,
  MainNavComponent,
  NavBarComponent,
  LoadingComponent,
  FooterComponent,
];

const ANGULAR_MODULES: any[] = [FormsModule, ReactiveFormsModule];

const OTHER_MODULES: any[] = [];

@NgModule({
  declarations: [COMPONENTS],
  imports: [CommonModule, RouterModule, ANGULAR_MODULES, OTHER_MODULES],
  exports: [CommonModule, ANGULAR_MODULES, OTHER_MODULES, COMPONENTS],
})
export class SharedModule {}
