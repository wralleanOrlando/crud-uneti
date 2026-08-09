import { Categoria } from './categoria.model';

// Representa un producto del inventario (ej: Laptop, Escritorio)
export interface Producto {
  id?: number;            // Identificador único del producto
  categoria_id: number;   // Categoría a la que pertenece el producto
  nombre: string;         // Nombre del producto
  descripcion?: string;   // Descripción opcional del producto
  precio: number;         // Precio del producto
  sku?: string;           // Código único de identificación del producto
  created_at?: string;    // Fecha de creación del registro
  categorias?: Categoria; // Datos de la categoría asociada
}
