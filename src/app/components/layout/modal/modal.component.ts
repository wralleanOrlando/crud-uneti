import { Component, input, output } from '@angular/core';

// Componente de ventana modal reutilizable para formularios y contenido
@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    @if (open()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="fixed inset-0 bg-black/50" (click)="cerrar.emit()"></div>
        <div class="relative bg-white rounded-lg shadow-xl w-full mx-4 max-h-[90vh] overflow-y-auto"
             [class]="tamano() === 'lg' ? 'max-w-2xl' : tamano() === 'sm' ? 'max-w-sm' : 'max-w-lg'">
          <div class="flex justify-between items-center p-4 border-b">
            <h2 class="text-lg font-semibold">{{ titulo() }}</h2>
            <button (click)="cerrar.emit()" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
          </div>
          <div class="p-4">
            <ng-content />
          </div>
        </div>
      </div>
    }
  `
})
export class ModalComponent {
  open = input(false);
  titulo = input('');
  tamano = input<'sm' | 'md' | 'lg'>('md');
  cerrar = output();
}
