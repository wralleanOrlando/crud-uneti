import { Component, OnInit, OnDestroy, signal } from '@angular/core';

// Componente de carga que muestra un mensaje animado mientras se obtienen los datos
@Component({
  selector: 'app-loading',
  standalone: true,
  template: `
    <div class="flex flex-col items-center justify-center py-12">
      <div class="text-lg text-gray-500">Cargando{{ dots() }}</div>
    </div>
  `
})
export class LoadingComponent implements OnInit, OnDestroy {
  dots = signal('.');
  private intervalId: any;

  // Inicia la animacion de puntos suspensivos cada 400ms
  ngOnInit() {
    this.intervalId = setInterval(() => {
      const current = this.dots();
      this.dots.set(current === '...' ? '.' : current + '.');
    }, 400);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}
