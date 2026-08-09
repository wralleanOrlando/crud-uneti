import { Injectable, inject } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { SupabaseService } from './supabase.service';
import { Estado } from '../models/estado.model';

// Servicio para gestionar los estados de stock en la base de datos
@Injectable({ providedIn: 'root' })
export class EstadoService {
  private supabase = inject(SupabaseService).getClient();
  private logger = inject(NGXLogger);

  // Obtiene todos los estados ordenados por ID
  async getAll(): Promise<Estado[]> {
    this.logger.debug('[EstadoService] Cargando estados...');
    const { data, error } = await this.supabase
      .from('estados')
      .select('*')
      .order('id');
    if (error) {
      this.logger.error('[EstadoService] Error al cargar estados', error);
      throw error;
    }
    this.logger.debug(`[EstadoService] Estados cargados: ${data?.length}`);
    return data || [];
  }

  // Busca un estado por su ID
  async getById(id: number): Promise<Estado | null> {
    this.logger.debug(`[EstadoService] Buscando estado id=${id}`);
    const { data, error } = await this.supabase
      .from('estados')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      this.logger.error(`[EstadoService] Error al buscar estado id=${id}`, error);
      throw error;
    }
    return data;
  }
}
