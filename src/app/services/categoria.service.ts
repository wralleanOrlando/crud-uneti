import { Injectable, inject } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { SupabaseService } from './supabase.service';
import { Categoria } from '../models/categoria.model';

// Servicio para gestionar las categorías en la base de datos
@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private supabase = inject(SupabaseService).getClient();
  private logger = inject(NGXLogger);

  // Obtiene todas las categorías ordenadas por nombre
  async getAll(): Promise<Categoria[]> {
    this.logger.debug('[CategoriaService] Cargando categorías...');
    const { data, error } = await this.supabase
      .from('categorias')
      .select('*')
      .order('nombre');
    if (error) {
      this.logger.error('[CategoriaService] Error al cargar categorías', error);
      throw error;
    }
    this.logger.debug(`[CategoriaService] Categorías cargadas: ${data?.length}`);
    return data || [];
  }

  // Busca una categoría por su ID
  async getById(id: number): Promise<Categoria | null> {
    this.logger.debug(`[CategoriaService] Buscando categoría id=${id}`);
    const { data, error } = await this.supabase
      .from('categorias')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      this.logger.error(`[CategoriaService] Error al buscar categoría id=${id}`, error);
      throw error;
    }
    return data;
  }

  // Crea una nueva categoría
  async create(categoria: Categoria): Promise<Categoria> {
    this.logger.info('[CategoriaService] Creando categoría', categoria.nombre);
    const { data, error } = await this.supabase
      .from('categorias')
      .insert(categoria)
      .select()
      .single();
    if (error) {
      this.logger.error('[CategoriaService] Error al crear categoría', error);
      throw error;
    }
    this.logger.info('[CategoriaService] Categoría creada con éxito', data);
    return data;
  }

  // Actualiza una categoría existente
  async update(id: number, categoria: Partial<Categoria>): Promise<Categoria> {
    this.logger.info(`[CategoriaService] Actualizando categoría id=${id}`, categoria);
    const { id: _, created_at: __, ...payload } = categoria;
    const { data, error } = await this.supabase
      .from('categorias')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) {
      this.logger.error(`[CategoriaService] Error al actualizar categoría id=${id}`, error);
      throw error;
    }
    this.logger.info('[CategoriaService] Categoría actualizada con éxito', data);
    return data;
  }

  // Elimina una categoría por su ID
  async delete(id: number): Promise<void> {
    this.logger.warn(`[CategoriaService] Eliminando categoría id=${id}`);
    const { error } = await this.supabase
      .from('categorias')
      .delete()
      .eq('id', id);
    if (error) {
      this.logger.error(`[CategoriaService] Error al eliminar categoría id=${id}`, error);
      throw error;
    }
    this.logger.info(`[CategoriaService] Categoría eliminada id=${id}`);
  }

  // Cuenta el total de categorías registradas
  async count(): Promise<number> {
    this.logger.debug('[CategoriaService] Contando categorías...');
    const { count, error } = await this.supabase
      .from('categorias')
      .select('*', { count: 'exact', head: true });
    if (error) {
      this.logger.error('[CategoriaService] Error al contar categorías', error);
      throw error;
    }
    return count || 0;
  }
}
