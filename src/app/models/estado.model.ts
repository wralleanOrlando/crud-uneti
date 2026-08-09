// Representa el estado de un registro de stock (ej: disponible, en uso, dañado)
export interface Estado {
  id?: number;           // Identificador único del estado
  nombre: string;        // Nombre del estado
  descripcion?: string;  // Descripción opcional del estado
}
