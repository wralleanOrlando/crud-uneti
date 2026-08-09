import { Estado } from './estado.model';
import { Producto } from './producto.model';

// Representa un registro de stock de un producto en inventario
export interface Stock {
  id?: number;            // Identificador único del registro de stock
  producto_id: number;    // Producto al que pertenece este stock
  cantidad: number;       // Cantidad de unidades disponibles
  ubicacion?: string;     // Ubicación física del stock (ej: Laboratorio 3)
  estado_id: number;      // Estado del stock (disponible, en uso, dañado, etc.)
  fecha_ingreso?: string; // Fecha en que ingresó el stock
  observaciones?: string; // Notas adicionales sobre el registro
  updated_at?: string;    // Fecha de la última actualización
  productos?: Producto;   // Datos del producto asociado
  estados?: Estado;       // Datos del estado asociado
}
