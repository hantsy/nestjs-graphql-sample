import { Component, inject, computed } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  title = 'NestJS GraphQL Blog';
  private readonly themeService = inject(ThemeService);
  readonly isDark = this.themeService.isDark;
  readonly themeIcon = computed(() => this.isDark() ? 'light_mode' : 'dark_mode');
  readonly themeLabel = computed(() => this.isDark() ? 'Switch to light mode' : 'Switch to dark mode');

  toggleTheme(): void {
    this.themeService.toggle();
  }
}
