import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NGXLogger } from 'ngx-logger';
import { StockService } from '../../../services/stock.service';
import { ToastService } from '../../../services/toast.service';
import { Stock } from '../../../models/stock.model';
import { LoadingComponent } from '../../layout/loading/loading.component';
import { EmptyStateComponent } from '../../layout/empty-state/empty-state.component';
import { ModalComponent } from '../../layout/modal/modal.component';
import { ConfirmModalComponent } from '../../layout/confirm-modal/confirm-modal.component';
import { StockFormComponent } from '../stock-form/stock-form.component';

// Página que muestra la lista de registros de stock con opciones para crear, editar y eliminar
@Component({
  selector: 'app-stock-list',
  standalone: true,
  imports: [DatePipe, LoadingComponent, EmptyStateComponent, ModalComponent, ConfirmModalComponent, StockFormComponent],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Stock</h1>
        <button (click)="abrirNuevo()"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          + Nuevo Registro
        </button>
      </div>

      @if (loading()) {
        <app-loading />
      } @else if (items().length === 0) {
        <app-empty-state [message]="'No hay registros de stock'" />
      } @else {
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ubicacion</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              @for (item of items(); track item.id) {
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 text-sm text-gray-500">{{ item.id }}</td>
                  <td class="px-6 py-4 text-sm font-medium">{{ item.productos?.nombre || '-' }}</td>
                  <td class="px-6 py-4 text-sm text-gray-500">{{ item.productos?.categorias?.nombre || '-' }}</td>
                  <td class="px-6 py-4 text-sm text-right font-semibold">{{ item.cantidad }}</td>
                  <td class="px-6 py-4 text-sm">
                    <span [class]="getEstadoClass(item.estados?.nombre)"
                          class="px-2 py-1 rounded-full text-xs font-medium">
                      {{ item.estados?.nombre || '-' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500">{{ item.ubicacion || '-' }}</td>
                  <td class="px-6 py-4 text-sm text-gray-500">{{ item.fecha_ingreso | date:'dd/MM/yyyy' }}</td>
                  <td class="px-6 py-4 text-right text-sm space-x-2">
                    <button (click)="abrirEditar(item)" class="text-blue-600 hover:text-blue-800">Editar</button>
                    <button (click)="abrirConfirm(item)" class="text-red-600 hover:text-red-800">Eliminar</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>

    <app-modal [open]="modalAbierto()" [titulo]="editandoItem() ? 'Editar Stock' : 'Nuevo Stock'" [tamano]="'lg'" (cerrar)="cerrarModal()">
      <app-stock-form [item]="editandoItem()" (guardado)="cerrarModal()" (cerrar)="cerrarModal()" />
    </app-modal>

    <app-confirm-modal
      [open]="confirmAbierto()"
      [mensaje]="'Estas seguro de eliminar el registro de stock #' + ((itemAEliminar()?.id) || '') + '?'"
      (confirmar)="confirmarEliminar()"
      (cancelar)="cerrarConfirm()" />
  `
})
export class StockListComponent implements OnInit {
  private service = inject(StockService);
  private logger = inject(NGXLogger);
  private toast = inject(ToastService);

  items = signal<Stock[]>([]);
  loading = signal(true);
  modalAbierto = signal(false);
  editandoItem = signal<Stock | null>(null);
  confirmAbierto = signal(false);
  itemAEliminar = signal<Stock | null>(null);

  // Carga la lista de registros de stock al iniciar la página
  async ngOnInit() {
    await this.cargar();
  }

  // Obtiene todos los registros de stock desde la base de datos
  async cargar() {
    this.loading.set(true);
    try {
      const data = await this.service.getAll();
      this.items.set(data);
    } catch (err: any) {
      this.logger.error('Error al cargar stock', err);
      this.toast.error('Error al cargar registros de stock');
    } finally {
      this.loading.set(false);
    }
  }

  // Abre el modal para crear un nuevo registro de stock
  abrirNuevo() {
    this.editandoItem.set(null);
    this.modalAbierto.set(true);
  }

  // Abre el modal para editar un registro de stock existente
  abrirEditar(item: Stock) {
    this.editandoItem.set(item);
    this.modalAbierto.set(true);
  }

  // Cierra el modal de formulario y recarga la lista
  cerrarModal() {
    this.modalAbierto.set(false);
    this.editandoItem.set(null);
    this.cargar();
  }

  // Abre el diálogo de confirmación para eliminar un registro de stock
  abrirConfirm(item: Stock) {
    this.itemAEliminar.set(item);
    this.confirmAbierto.set(true);
  }

  // Cierra el diálogo de confirmación
  cerrarConfirm() {
    this.confirmAbierto.set(false);
    this.itemAEliminar.set(null);
  }

  // Elimina el registro de stock seleccionado y recarga la lista
  async confirmarEliminar() {
    const item = this.itemAEliminar();
    if (!item) return;
    try {
      await this.service.delete(item.id!);
      this.toast.success('Registro de stock eliminado');
      this.cerrarConfirm();
      await this.cargar();
    } catch (err: any) {
      this.logger.error('Error al eliminar stock', err);
      this.toast.error('Error al eliminar registro de stock');
    }
  }

  // Devuelve la clase de color según el estado del stock
  getEstadoClass(estado?: string): string {
    switch (estado) {
      case 'disponible': return 'bg-green-100 text-green-800';
      case 'en_uso': return 'bg-blue-100 text-blue-800';
      case 'en_mantenimiento': return 'bg-yellow-100 text-yellow-800';
      case 'danado': return 'bg-red-100 text-red-800';
      case 'agotado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
