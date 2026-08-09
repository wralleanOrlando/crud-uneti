import { Component, inject, signal, input, output, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { ProductoService } from '../../../services/producto.service';
import { CategoriaService } from '../../../services/categoria.service';
import { ToastService } from '../../../services/toast.service';
import { Producto } from '../../../models/producto.model';
import { Categoria } from '../../../models/categoria.model';

// Formulario para crear o editar un producto
@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <form (ngSubmit)="guardar()" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
        <input type="text" [(ngModel)]="form().nombre" name="nombre" required
               class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
               placeholder="Nombre del producto">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
        <select [(ngModel)]="form().categoria_id" name="categoria_id"
                class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
          <option [ngValue]="0">Sin categoria</option>
          @for (cat of categorias(); track cat.id) {
            <option [ngValue]="cat.id">{{ cat.nombre }}</option>
          }
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Descripcion</label>
        <textarea [(ngModel)]="form().descripcion" name="descripcion" rows="3"
                  class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Descripcion opcional"></textarea>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
          <input type="number" [(ngModel)]="form().precio" name="precio" required min="0" step="0.01"
                 class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                 placeholder="0.00">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Código</label>
          <input type="text" [(ngModel)]="form().sku" name="sku"
                 class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                 placeholder="Código opcional">
        </div>
      </div>
      <div class="flex justify-end gap-3 pt-2">
        <button type="button" (click)="cerrar.emit()"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
          Cancelar
        </button>
        <button type="submit" [disabled]="guardando()"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
          {{ guardando() ? 'Guardando...' : 'Guardar' }}
        </button>
      </div>
    </form>
  `
})
export class ProductoFormComponent {
  private service = inject(ProductoService);
  private categoriaService = inject(CategoriaService);
  private logger = inject(NGXLogger);
  private toast = inject(ToastService);

  item = input<Producto | null>(null);
  guardado = output<void>();
  cerrar = output<void>();

  form = signal<Producto>({ nombre: '', descripcion: '', precio: 0, sku: '', categoria_id: 0 });
  categorias = signal<Categoria[]>([]);
  editando = signal(false);
  guardando = signal(false);

  constructor() {
    effect(() => {
      const currentItem = this.item();
      if (currentItem) {
        this.editando.set(true);
        this.form.set({ ...currentItem });
      } else {
        this.editando.set(false);
        this.form.set({ nombre: '', descripcion: '', precio: 0, sku: '', categoria_id: 0 });
      }
    });
  }

  // Carga la lista de categorías disponibles para el selector
  async ngOnInit() {
    try {
      const cats = await this.categoriaService.getAll();
      this.categorias.set(cats);
    } catch (err: any) {
      this.logger.error('Error al cargar categorias', err);
    }
  }

  // Guarda el producto (crea o actualiza según corresponda)
  async guardar() {
    this.guardando.set(true);
    try {
      const payload = { ...this.form() };
      if (!payload.categoria_id) payload.categoria_id = 0;
      if (this.editando()) {
        await this.service.update(this.form().id!, payload);
      } else {
        await this.service.create(payload);
      }
      this.toast.success(this.editando() ? 'Producto actualizado' : 'Producto creado');
      this.guardado.emit();
    } catch (err: any) {
      this.logger.error('Error al guardar', err);
      this.toast.error(err.message || 'Error al guardar');
    } finally {
      this.guardando.set(false);
    }
  }
}
