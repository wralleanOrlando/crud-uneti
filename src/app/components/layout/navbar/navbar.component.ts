import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

// Barra de navegacion principal con enlaces al dashboard, categorias, productos y stock
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="bg-gray-800 text-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <a routerLink="/" class="text-xl font-bold">Inventario</a>
          <div class="flex space-x-4">
            <a routerLink="/" routerLinkActive="bg-gray-900" [routerLinkActiveOptions]="{exact: true}"
               class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition">
              Dashboard
            </a>
            <a routerLink="/categorias" routerLinkActive="bg-gray-900"
               class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition">
              Categorias
            </a>
            <a routerLink="/productos" routerLinkActive="bg-gray-900"
               class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition">
              Productos
            </a>
            <a routerLink="/stock" routerLinkActive="bg-gray-900"
               class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition">
              Stock
            </a>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {}
