import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have title', () => {
    const app = fixture.componentInstance;
    expect(app.title).toBe('NestJS GraphQL Blog');
  });

  it('should render toolbar', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-toolbar')).toBeTruthy();
  });
});
