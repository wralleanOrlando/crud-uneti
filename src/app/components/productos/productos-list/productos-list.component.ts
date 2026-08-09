import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { NGXLogger } from 'ngx-logger';
import { ProductoService } from '../../../services/producto.service';
import { ToastService } from '../../../services/toast.service';
import { Producto } from '../../../models/producto.model';
import { LoadingComponent } from '../../layout/loading/loading.component';
import { EmptyStateComponent } from '../../layout/empty-state/empty-state.component';
import { ModalComponent } from '../../layout/modal/modal.component';
import { ConfirmModalComponent } from '../../layout/confirm-modal/confirm-modal.component';
import { ProductoFormComponent } from '../producto-form/producto-form.component';

// Página que muestra la lista de productos con opciones para crear, editar y eliminar
@Component({
  selector: 'app-productos-list',
  standalone: true,
  imports: [DecimalPipe, LoadingComponent, EmptyStateComponent, ModalComponent, ConfirmModalComponent, ProductoFormComponent],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Productos</h1>
        <button (click)="abrirNuevo()"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          + Nuevo Producto
        </button>
      </div>

      @if (loading()) {
        <app-loading />
      } @else if (items().length === 0) {
        <app-empty-state [message]="'No hay productos registrados'" />
      } @else {
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Precio</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              @for (prod of items(); track prod.id) {
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 text-sm text-gray-500">{{ prod.id }}</td>
                  <td class="px-6 py-4 text-sm font-medium">{{ prod.nombre }}</td>
                  <td class="px-6 py-4 text-sm text-gray-500">{{ prod.categorias?.nombre || '-' }}</td>
                  <td class="px-6 py-4 text-sm text-gray-500">{{ prod.sku || '-' }}</td>
                  <td class="px-6 py-4 text-sm text-right">\${{ prod.precio | number:'1.2-2' }}</td>
                  <td class="px-6 py-4 text-right text-sm space-x-2">
                    <button (click)="abrirEditar(prod)" class="text-blue-600 hover:text-blue-800">Editar</button>
                    <button (click)="abrirConfirm(prod)" class="text-red-600 hover:text-red-800">Eliminar</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>

    <app-modal [open]="modalAbierto()" [titulo]="editandoItem() ? 'Editar Producto' : 'Nuevo Producto'" (cerrar)="cerrarModal()">
      <app-producto-form [item]="editandoItem()" (guardado)="cerrarModal()" (cerrar)="cerrarModal()" />
    </app-modal>

    <app-confirm-modal
      [open]="confirmAbierto()"
      [mensaje]="'Estas seguro de eliminar el producto ' + (itemAEliminar()?.nombre || '') + '?'"
      (confirmar)="confirmarEliminar()"
      (cancelar)="cerrarConfirm()" />
  `
})
export class ProductosListComponent implements OnInit {
  private service = inject(ProductoService);
  private logger = inject(NGXLogger);
  private toast = inject(ToastService);

  items = signal<Producto[]>([]);
  loading = signal(true);
  modalAbierto = signal(false);
  editandoItem = signal<Producto | null>(null);
  confirmAbierto = signal(false);
  itemAEliminar = signal<Producto | null>(null);

  // Carga la lista de productos al iniciar la página
  async ngOnInit() {
    await this.cargar();
  }

  // Obtiene todos los productos desde la base de datos
  async cargar() {
    this.loading.set(true);
    try {
      const data = await this.service.getAll();
      this.items.set(data);
    } catch (err: any) {
      this.logger.error('Error al cargar', err);
      this.toast.error('Error al cargar productos');
    } finally {
      this.loading.set(false);
    }
  }

  // Abre el modal para crear un nuevo producto
  abrirNuevo() {
    this.editandoItem.set(null);
    this.modalAbierto.set(true);
  }

  // Abre el modal para editar un producto existente
  abrirEditar(item: Producto) {
    this.editandoItem.set(item);
    this.modalAbierto.set(true);
  }

  // Cierra el modal de formulario y recarga la lista
  cerrarModal() {
    this.modalAbierto.set(false);
    this.editandoItem.set(null);
    this.cargar();
  }

  // Abre el diálogo de confirmación para eliminar un producto
  abrirConfirm(item: Producto) {
    this.itemAEliminar.set(item);
    this.confirmAbierto.set(true);
  }

  // Cierra el diálogo de confirmación
  cerrarConfirm() {
    this.confirmAbierto.set(false);
    this.itemAEliminar.set(null);
  }

  // Elimina el producto seleccionado y recarga la lista
  async confirmarEliminar() {
    const item = this.itemAEliminar();
    if (!item) return;
    try {
      await this.service.delete(item.id!);
      this.toast.success(`Producto "${item.nombre}" eliminado`);
      this.cerrarConfirm();
      await this.cargar();
    } catch (err: any) {
      this.logger.error('Error al eliminar', err);
      this.toast.error('Error al eliminar producto');
    }
  }
}
