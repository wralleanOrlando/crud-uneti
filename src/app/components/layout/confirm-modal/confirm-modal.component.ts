import { Component, input, output } from '@angular/core';

// Componente de diálogo de confirmación para acciones como eliminar registros
@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  template: `
    @if (open()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="fixed inset-0 bg-black/50" (click)="cancelar.emit()"></div>
        <div class="relative bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 p-6">
          <h3 class="text-lg font-semibold mb-2">{{ titulo() }}</h3>
          <p class="text-gray-600 mb-6">{{ mensaje() }}</p>
          <div class="flex justify-end gap-3">
            <button (click)="cancelar.emit()"
                    class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
              Cancelar
            </button>
            <button (click)="confirmar.emit()"
                    class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
              Aceptar
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class ConfirmModalComponent {
  open = input(false);
  titulo = input('Eliminar Registro');
  mensaje = input('Estas seguro de que deseas eliminar este registro?');
  confirmar = output();
  cancelar = output();
}
