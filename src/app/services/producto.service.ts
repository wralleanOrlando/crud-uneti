import { Injectable, inject } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { SupabaseService } from './supabase.service';
import { Producto } from '../models/producto.model';

// Servicio para gestionar los productos en la base de datos
@Injectable({ providedIn: 'root' })
export class ProductoService {
  private supabase = inject(SupabaseService).getClient();
  private logger = inject(NGXLogger);

  // Obtiene todos los productos con su categoría, ordenados por nombre
  async getAll(): Promise<Producto[]> {
    this.logger.debug('[ProductoService] Cargando productos...');
    const { data, error } = await this.supabase
      .from('productos')
      .select('*, categorias(*)')
      .order('nombre');
    if (error) {
      this.logger.error('[ProductoService] Error al cargar productos', error);
      throw error;
    }
    this.logger.debug(`[ProductoService] Productos cargados: ${data?.length}`);
    return data || [];
  }

  // Busca un producto por su ID
  async getById(id: number): Promise<Producto | null> {
    this.logger.debug(`[ProductoService] Buscando producto id=${id}`);
    const { data, error } = await this.supabase
      .from('productos')
      .select('*, categorias(*)')
      .eq('id', id)
      .single();
    if (error) {
      this.logger.error(`[ProductoService] Error al buscar producto id=${id}`, error);
      throw error;
    }
    return data;
  }

  // Crea un nuevo producto
  async create(producto: Producto): Promise<Producto> {
    this.logger.info('[ProductoService] Creando producto', producto.nombre);
    const { data, error } = await this.supabase
      .from('productos')
      .insert(producto)
      .select('*, categorias(*)')
      .single();
    if (error) {
      this.logger.error('[ProductoService] Error al crear producto', error);
      throw error;
    }
    this.logger.info('[ProductoService] Producto creado con éxito', data);
    return data;
  }

  // Actualiza un producto existente
  async update(id: number, producto: Partial<Producto>): Promise<Producto> {
    this.logger.info(`[ProductoService] Actualizando producto id=${id}`, producto);
    const { id: _, created_at: __, categorias: ___, ...payload } = producto;
    const { data, error } = await this.supabase
      .from('productos')
      .update(payload)
      .eq('id', id)
      .select('*, categorias(*)')
      .single();
    if (error) {
      this.logger.error(`[ProductoService] Error al actualizar producto id=${id}`, error);
      throw error;
    }
    this.logger.info('[ProductoService] Producto actualizado con éxito', data);
    return data;
  }

  // Elimina un producto por su ID
  async delete(id: number): Promise<void> {
    this.logger.warn(`[ProductoService] Eliminando producto id=${id}`);
    const { error } = await this.supabase
      .from('productos')
      .delete()
      .eq('id', id);
    if (error) {
      this.logger.error(`[ProductoService] Error al eliminar producto id=${id}`, error);
      throw error;
    }
    this.logger.info(`[ProductoService] Producto eliminado id=${id}`);
  }

  // Cuenta el total de productos registrados
  async count(): Promise<number> {
    this.logger.debug('[ProductoService] Contando productos...');
    const { count, error } = await this.supabase
      .from('productos')
      .select('*', { count: 'exact', head: true });
    if (error) {
      this.logger.error('[ProductoService] Error al contar productos', error);
      throw error;
    }
    return count || 0;
  }
}
