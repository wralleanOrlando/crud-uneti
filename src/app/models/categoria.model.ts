// Representa una categoría de productos (ej: Electrónica, Mobiliario)
export interface Categoria {
  id?: number;           // Identificador único de la categoría
  nombre: string;        // Nombre de la categoría
  descripcion?: string;  // Descripción opcional de la categoría
  created_at?: string;   // Fecha de creación del registro
}
