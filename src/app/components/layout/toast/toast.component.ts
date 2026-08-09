import { Component, OnInit, inject } from '@angular/core';
import { ToastService, Toast } from '../../../services/toast.service';

// Componente que muestra las notificaciones emergentes en la esquina inferior derecha
@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      @for (toast of toasts; track toast.id) {
        <div [class]="getClasses(toast.type)"
             class="px-4 py-3 rounded-lg shadow-lg text-white text-sm min-w-72 max-w-96 flex justify-between items-center animate-slide-in">
          <span>{{ toast.message }}</span>
          <button (click)="remove(toast.id)" class="ml-3 text-white/80 hover:text-white font-bold">&times;</button>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slide-in {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .animate-slide-in { animation: slide-in 0.3s ease-out; }
  `]
})
export class ToastComponent implements OnInit {
  private toastService = inject(ToastService);
  toasts: Toast[] = [];

  // Se suscribe a las notificaciones para mostrarlas en pantalla
  ngOnInit() {
    this.toastService.toasts$.subscribe(toasts => this.toasts = toasts);
  }

  // Cierra una notificacion por su id
  remove(id: number) {
    this.toastService.remove(id);
  }

  // Devuelve el color de fondo segun el tipo de notificacion
  getClasses(type: Toast['type']): string {
    switch (type) {
      case 'success': return 'bg-green-600';
      case 'error': return 'bg-red-600';
      case 'info': return 'bg-blue-600';
      default: return 'bg-gray-600';
    }
  }
}
