import { Component, OnInit, inject, signal, input, output, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { CategoriaService } from '../../../services/categoria.service';
import { ToastService } from '../../../services/toast.service';
import { Categoria } from '../../../models/categoria.model';

// Formulario para crear o editar una categoría
@Component({
  selector: 'app-categoria-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <form (ngSubmit)="guardar()" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
        <input type="text" [(ngModel)]="form().nombre" name="nombre" required
               class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
               placeholder="Nombre de la categoria">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Descripcion</label>
        <textarea [(ngModel)]="form().descripcion" name="descripcion" rows="3"
                  class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Descripcion opcional"></textarea>
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
export class CategoriaFormComponent implements OnInit {
  private service = inject(CategoriaService);
  private logger = inject(NGXLogger);
  private toast = inject(ToastService);

  item = input<Categoria | null>(null);
  guardado = output<void>();
  cerrar = output<void>();

  form = signal<Categoria>({ nombre: '', descripcion: '' });
  editando = signal(false);
  guardando = signal(false);

  ngOnInit() {
    console.log('[CategoriaForm] ngOnInit - item:', this.item());
    this.sincronizarForm();
  }

  constructor() {
    effect(() => {
      const currentItem = this.item();
      console.log('[CategoriaForm] Effect - item:', currentItem);
      this.sincronizarForm();
    });
  }

  // Sincroniza el formulario con los datos del item recibido
  private sincronizarForm() {
    const currentItem = this.item();
    if (currentItem) {
      this.editando.set(true);
      this.form.set({ ...currentItem });
      console.log('[CategoriaForm] Form actualizado:', this.form());
    } else {
      this.editando.set(false);
      this.form.set({ nombre: '', descripcion: '' });
      console.log('[CategoriaForm] Form vacío');
    }
  }

  // Guarda la categoría (crea o actualiza según corresponda)
  async guardar() {
    console.log('[CategoriaForm] Guardar - editando:', this.editando(), 'form:', this.form());
    this.guardando.set(true);
    try {
      if (this.editando()) {
        await this.service.update(this.form().id!, this.form());
      } else {
        await this.service.create(this.form());
      }
      this.toast.success(this.editando() ? 'Categoria actualizada' : 'Categoria creada');
      console.log('[CategoriaForm] Emitiendo guardado');
      this.guardado.emit();
    } catch (err: any) {
      console.error('[CategoriaForm] Error:', err);
      this.logger.error('Error al guardar', err);
      this.toast.error(err.message || 'Error al guardar');
    } finally {
      this.guardando.set(false);
    }
  }
}
