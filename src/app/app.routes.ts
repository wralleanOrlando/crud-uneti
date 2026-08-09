import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CategoriasListComponent } from './components/categorias/categorias-list/categorias-list.component';
import { ProductosListComponent } from './components/productos/productos-list/productos-list.component';
import { StockListComponent } from './components/stock/stock-list/stock-list.component';

// Configuración de las rutas de navegación de la aplicación
export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'categorias', component: CategoriasListComponent },
  { path: 'productos', component: ProductosListComponent },
  { path: 'stock', component: StockListComponent },
  { path: '**', redirectTo: '' }
];
