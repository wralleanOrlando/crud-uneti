import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

// Servicio que maneja la conexión con la base de datos de Supabase
@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private client: SupabaseClient;

  // Crea la conexion con Supabase usando las credenciales del entorno
  constructor() {
    this.client = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // Devuelve el cliente de conexión a la base de datos
  getClient(): SupabaseClient {
    return this.client;
  }
}
