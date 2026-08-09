import { Component, OnInit, inject, signal } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { CategoriaService } from '../../../services/categoria.service';
import { ToastService } from '../../../services/toast.service';
import { Categoria } from '../../../models/categoria.model';
import { LoadingComponent } from '../../layout/loading/loading.component';
import { EmptyStateComponent } from '../../layout/empty-state/empty-state.component';
import { ModalComponent } from '../../layout/modal/modal.component';
import { ConfirmModalComponent } from '../../layout/confirm-modal/confirm-modal.component';
import { CategoriaFormComponent } from '../categoria-form/categoria-form.component';

// Página que muestra la lista de categorías con opciones para crear, editar y eliminar
@Component({
  selector: 'app-categorias-list',
  standalone: true,
  imports: [LoadingComponent, EmptyStateComponent, ModalComponent, ConfirmModalComponent, CategoriaFormComponent],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Categorias</h1>
        <button (click)="abrirNuevo()"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          + Nueva Categoria
        </button>
      </div>

      @if (loading()) {
        <app-loading />
      } @else if (items().length === 0) {
        <app-empty-state [message]="'No hay categorias registradas'" />
      } @else {
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripcion</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              @for (cat of items(); track cat.id) {
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 text-sm text-gray-500">{{ cat.id }}</td>
                  <td class="px-6 py-4 text-sm font-medium">{{ cat.nombre }}</td>
                  <td class="px-6 py-4 text-sm text-gray-500">{{ cat.descripcion || '-' }}</td>
                  <td class="px-6 py-4 text-right text-sm space-x-2">
                    <button (click)="abrirEditar(cat)" class="text-blue-600 hover:text-blue-800">Editar</button>
                    <button (click)="abrirConfirm(cat)" class="text-red-600 hover:text-red-800">Eliminar</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>

    <app-modal [open]="modalAbierto()" [titulo]="editandoItem() ? 'Editar Categoria' : 'Nueva Categoria'" (cerrar)="cerrarModal()">
      <app-categoria-form [item]="editandoItem()" (guardado)="cerrarModal()" (cerrar)="cerrarModal()" />
    </app-modal>

    <app-confirm-modal
      [open]="confirmAbierto()"
      [mensaje]="'Estas seguro de eliminar la categoria ' + (itemAEliminar()?.nombre || '') + '?'"
      (confirmar)="confirmarEliminar()"
      (cancelar)="cerrarConfirm()" />
  `
})
export class CategoriasListComponent implements OnInit {
  private service = inject(CategoriaService);
  private logger = inject(NGXLogger);
  private toast = inject(ToastService);

  items = signal<Categoria[]>([]);
  loading = signal(true);
  modalAbierto = signal(false);
  editandoItem = signal<Categoria | null>(null);
  confirmAbierto = signal(false);
  itemAEliminar = signal<Categoria | null>(null);

  // Carga la lista de categorías al iniciar la página
  async ngOnInit() {
    await this.cargar();
  }

  // Obtiene todas las categorías desde la base de datos
  async cargar() {
    this.loading.set(true);
    try {
      const data = await this.service.getAll();
      this.items.set(data);
    } catch (err: any) {
      this.logger.error('Error al cargar', err);
      this.toast.error('Error al cargar categorias');
    } finally {
      this.loading.set(false);
    }
  }

  // Abre el modal para crear una nueva categoría
  abrirNuevo() {
    console.log('[CategoriasList] abrirNuevo');
    this.editandoItem.set(null);
    this.modalAbierto.set(true);
  }

  // Abre el modal para editar una categoría existente
  abrirEditar(item: Categoria) {
    console.log('[CategoriasList] abrirEditar:', item);
    this.editandoItem.set(item);
    this.modalAbierto.set(true);
  }

  // Cierra el modal de formulario y recarga la lista
  cerrarModal() {
    console.log('[CategoriasList] cerrarModal');
    this.modalAbierto.set(false);
    this.editandoItem.set(null);
    this.cargar();
  }

  // Abre el diálogo de confirmación para eliminar una categoría
  abrirConfirm(item: Categoria) {
    this.itemAEliminar.set(item);
    this.confirmAbierto.set(true);
  }

  // Cierra el diálogo de confirmación
  cerrarConfirm() {
    this.confirmAbierto.set(false);
    this.itemAEliminar.set(null);
  }

  // Elimina la categoría seleccionada y recarga la lista
  async confirmarEliminar() {
    const item = this.itemAEliminar();
    if (!item) return;
    try {
      await this.service.delete(item.id!);
      this.toast.success(`Categoria "${item.nombre}" eliminada`);
      this.cerrarConfirm();
      await this.cargar();
    } catch (err: any) {
      this.logger.error('Error al eliminar', err);
      this.toast.error('Error al eliminar categoria');
    }
  }
}
