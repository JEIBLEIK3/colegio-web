import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

/**
 * Cliente único de Supabase para toda la app (datos vía SupabaseRepository
 * y autenticación vía AuthService). Se instancia una sola vez porque
 * `createClient` abre su propio manejo de sesión/localStorage internamente.
 */
export const supabase = createClient(environment.supabase.url, environment.supabase.anonKey);
