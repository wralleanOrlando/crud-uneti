import { Injectable, inject } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { SupabaseService } from './supabase.service';
import { Stock } from '../models/stock.model';

// Servicio para gestionar los registros de stock en la base de datos
@Injectable({ providedIn: 'root' })
export class StockService {
  private supabase = inject(SupabaseService).getClient();
  private logger = inject(NGXLogger);

  // Obtiene todos los registros de stock con producto y estado, ordenados por fecha
  async getAll(): Promise<Stock[]> {
    this.logger.debug('[StockService] Cargando stock...');
    const { data, error } = await this.supabase
      .from('stock')
      .select('*, productos(*, categorias(*)), estados(*)')
      .order('fecha_ingreso', { ascending: false });
    if (error) {
      this.logger.error('[StockService] Error al cargar stock', error);
      throw error;
    }
    this.logger.debug(`[StockService] Registros de stock cargados: ${data?.length}`);
    return data || [];
  }

  // Busca un registro de stock por su ID
  async getById(id: number): Promise<Stock | null> {
    this.logger.debug(`[StockService] Buscando stock id=${id}`);
    const { data, error } = await this.supabase
      .from('stock')
      .select('*, productos(*, categorias(*)), estados(*)')
      .eq('id', id)
      .single();
    if (error) {
      this.logger.error(`[StockService] Error al buscar stock id=${id}`, error);
      throw error;
    }
    return data;
  }

  // Crea un nuevo registro de stock
  async create(stock: Stock): Promise<Stock> {
    this.logger.info('[StockService] Creando registro de stock', stock);
    const { data, error } = await this.supabase
      .from('stock')
      .insert(stock)
      .select('*, productos(*, categorias(*)), estados(*)')
      .single();
    if (error) {
      this.logger.error('[StockService] Error al crear stock', error);
      throw error;
    }
    this.logger.info('[StockService] Stock creado con éxito', data);
    return data;
  }

  // Actualiza un registro de stock existente
  async update(id: number, stock: Partial<Stock>): Promise<Stock> {
    this.logger.info(`[StockService] Actualizando stock id=${id}`, stock);
    const { id: _, productos: __, estados: ___, ...payload } = stock;
    const { data, error } = await this.supabase
      .from('stock')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*, productos(*, categorias(*)), estados(*)')
      .single();
    if (error) {
      this.logger.error(`[StockService] Error al actualizar stock id=${id}`, error);
      throw error;
    }
    this.logger.info('[StockService] Stock actualizado con éxito', data);
    return data;
  }

  // Elimina un registro de stock por su ID
  async delete(id: number): Promise<void> {
    this.logger.warn(`[StockService] Eliminando stock id=${id}`);
    const { error } = await this.supabase
      .from('stock')
      .delete()
      .eq('id', id);
    if (error) {
      this.logger.error(`[StockService] Error al eliminar stock id=${id}`, error);
      throw error;
    }
    this.logger.info(`[StockService] Stock eliminado id=${id}`);
  }

  // Calcula la suma total de todas las unidades en stock
  async totalCantidad(): Promise<number> {
    this.logger.debug('[StockService] Calculando total de cantidad...');
    const { data, error } = await this.supabase
      .from('stock')
      .select('cantidad');
    if (error) {
      this.logger.error('[StockService] Error al calcular total', error);
      throw error;
    }
    const total = (data || []).reduce((sum, item) => sum + item.cantidad, 0);
    this.logger.debug(`[StockService] Total cantidad: ${total}`);
    return total;
  }
}
