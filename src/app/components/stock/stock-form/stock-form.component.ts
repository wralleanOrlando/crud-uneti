import { Component, inject, signal, input, output, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { StockService } from '../../../services/stock.service';
import { ProductoService } from '../../../services/producto.service';
import { EstadoService } from '../../../services/estado.service';
import { ToastService } from '../../../services/toast.service';
import { Stock } from '../../../models/stock.model';
import { Producto } from '../../../models/producto.model';
import { Estado } from '../../../models/estado.model';

// Formulario para crear o editar un registro de stock
@Component({
  selector: 'app-stock-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <form (ngSubmit)="guardar()" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Producto *</label>
        <select [(ngModel)]="form().producto_id" name="producto_id" required
                class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
          <option [ngValue]="0" disabled>Seleccionar producto</option>
          @for (prod of productos(); track prod.id) {
            <option [ngValue]="prod.id">{{ prod.nombre }}</option>
          }
        </select>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Cantidad *</label>
          <input type="number" [(ngModel)]="form().cantidad" name="cantidad" required min="0"
                 class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                 placeholder="0">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
          <select [(ngModel)]="form().estado_id" name="estado_id" required
                  class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <option [ngValue]="0" disabled>Seleccionar estado</option>
            @for (est of estados(); track est.id) {
              <option [ngValue]="est.id">{{ est.nombre }}</option>
            }
          </select>
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Ubicacion</label>
        <input type="text" [(ngModel)]="form().ubicacion" name="ubicacion"
               class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
               placeholder="Ej: Laboratorio 3">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de Ingreso</label>
        <input type="date" [(ngModel)]="form().fecha_ingreso" name="fecha_ingreso"
               class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
        <textarea [(ngModel)]="form().observaciones" name="observaciones" rows="3"
                  class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Notas adicionales"></textarea>
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
export class StockFormComponent {
  private service = inject(StockService);
  private productoService = inject(ProductoService);
  private estadoService = inject(EstadoService);
  private logger = inject(NGXLogger);
  private toast = inject(ToastService);

  item = input<Stock | null>(null);
  guardado = output<void>();
  cerrar = output<void>();

  form = signal<Stock>({
    producto_id: 0, cantidad: 0, ubicacion: '', estado_id: 0,
    fecha_ingreso: new Date().toISOString().split('T')[0], observaciones: ''
  });
  productos = signal<Producto[]>([]);
  estados = signal<Estado[]>([]);
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
        this.form.set({
          producto_id: 0, cantidad: 0, ubicacion: '', estado_id: 0,
          fecha_ingreso: new Date().toISOString().split('T')[0], observaciones: ''
        });
      }
    });
  }

  // Carga la lista de productos y estados disponibles para los selectores
  async ngOnInit() {
    try {
      const [prods, ests] = await Promise.all([
        this.productoService.getAll(),
        this.estadoService.getAll()
      ]);
      this.productos.set(prods);
      this.estados.set(ests);
    } catch (err: any) {
      this.logger.error('Error al cargar datos', err);
    }
  }

  // Guarda el registro de stock (crea o actualiza según corresponda)
  async guardar() {
    if (!this.form().producto_id || !this.form().estado_id) {
      this.toast.error('Selecciona un producto y un estado');
      return;
    }
    this.guardando.set(true);
    try {
      if (this.editando()) {
        await this.service.update(this.form().id!, this.form());
      } else {
        await this.service.create(this.form());
      }
      this.toast.success(this.editando() ? 'Stock actualizado' : 'Stock creado');
      this.guardado.emit();
    } catch (err: any) {
      this.logger.error('Error al guardar', err);
      this.toast.error(err.message || 'Error al guardar');
    } finally {
      this.guardando.set(false);
    }
  }
}
