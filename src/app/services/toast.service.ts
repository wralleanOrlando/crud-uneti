import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

// Representa una notificación emergente (toast)
export interface Toast {
  id: number;                           // Identificador único del toast
  message: string;                      // Mensaje a mostrar
  type: 'success' | 'error' | 'info';   // Tipo de notificación
}

// Servicio para mostrar notificaciones temporales al usuario
@Injectable({ providedIn: 'root' })
export class ToastService {
  private toasts: Toast[] = [];
  private toastsSubject = new Subject<Toast[]>();
  private counter = 0;

  // Observable que emite la lista actual de toasts
  toasts$ = this.toastsSubject.asObservable();

  // Muestra una notificación de éxito (verde)
  success(message: string) {
    this.add(message, 'success');
  }

  // Muestra una notificación de error (rojo)
  error(message: string) {
    this.add(message, 'error');
  }

  // Muestra una notificación informativa (azul)
  info(message: string) {
    this.add(message, 'info');
  }

  // Elimina una notificación por su ID
  remove(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.toastsSubject.next([...this.toasts]);
  }

  // Agrega una notificación y la elimina automáticamente después de 5 segundos
  private add(message: string, type: Toast['type']) {
    const toast: Toast = { id: ++this.counter, message, type };
    this.toasts.push(toast);
    this.toastsSubject.next([...this.toasts]);
    setTimeout(() => this.remove(toast.id), 5000);
  }
}
