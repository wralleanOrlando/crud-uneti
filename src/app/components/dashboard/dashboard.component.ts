import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoriaService } from '../../services/categoria.service';
import { ProductoService } from '../../services/producto.service';
import { StockService } from '../../services/stock.service';
import { LoadingComponent } from '../layout/loading/loading.component';

// Página principal que muestra un resumen con el total de categorías, productos y stock
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, LoadingComponent],
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-bold mb-8">Dashboard</h1>
      @if (loading()) {
        <app-loading />
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a routerLink="/categorias" class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div class="text-sm text-gray-500">Categorias</div>
            <div class="text-4xl font-bold text-blue-600 mt-2">{{ categorias() }}</div>
            <div class="text-sm text-gray-400 mt-1">Registradas</div>
          </a>
          <a routerLink="/productos" class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div class="text-sm text-gray-500">Productos</div>
            <div class="text-4xl font-bold text-green-600 mt-2">{{ productos() }}</div>
            <div class="text-sm text-gray-400 mt-1">Registrados</div>
          </a>
          <a routerLink="/stock" class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div class="text-sm text-gray-500">Stock Total</div>
            <div class="text-4xl font-bold text-purple-600 mt-2">{{ stock() }}</div>
            <div class="text-sm text-gray-400 mt-1">Unidades</div>
          </a>
        </div>
      }
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private categoriaService = inject(CategoriaService);
  private productoService = inject(ProductoService);
  private stockService = inject(StockService);

  categorias = signal(0);
  productos = signal(0);
  stock = signal(0);
  loading = signal(true);

  // Carga los totales de categorías, productos y stock al iniciar
  async ngOnInit() {
    try {
      const [c, p, s] = await Promise.all([
        this.categoriaService.count(),
        this.productoService.count(),
        this.stockService.totalCantidad()
      ]);
      this.categorias.set(c);
      this.productos.set(p);
      this.stock.set(s);
    } catch (err) {
      console.error('Error loading dashboard', err);
    } finally {
      this.loading.set(false);
    }
  }
}
