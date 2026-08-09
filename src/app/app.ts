import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/layout/navbar/navbar.component';
import { ToastComponent } from './components/layout/toast/toast.component';

// Componente raíz de la aplicación que contiene la barra de navegación y las rutas
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ToastComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="max-w-7xl mx-auto">
      <router-outlet></router-outlet>
    </main>
    <app-toast></app-toast>
  `
})
export class AppComponent {}
