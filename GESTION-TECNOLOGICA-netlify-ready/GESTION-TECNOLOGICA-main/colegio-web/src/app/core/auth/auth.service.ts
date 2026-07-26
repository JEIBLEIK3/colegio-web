import { Injectable, computed, signal } from '@angular/core';
import { Observable, delay, from, of, throwError } from 'rxjs';
import { Rol, Usuario } from '../models/models';
import { SEED_USUARIOS } from '../data/seed-data';
import { supabase } from '../data/supabase-client';
import { environment } from '../../../environments/environment';

const SESSION_KEY = 'colegio_session';
/** Contraseña única para todos los usuarios demo del modo mock. */
const MOCK_PASSWORD = 'colegio123';

/**
 * Maneja el login y la sesión del usuario.
 * - `environment.useMockData = true`  -> credenciales simuladas (SEED_USUARIOS).
 * - `environment.useMockData = false` -> Supabase Auth real (`backend: 'supabase'`)
 *   o Amplify/Cognito (`backend: 'aws'`, ver ARQUITECTURA_AWS.md).
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly usuarioSignal = signal<Usuario | null>(this.leerSesion());

  readonly usuario = computed(() => this.usuarioSignal());
  readonly autenticado = computed(() => this.usuarioSignal() !== null);
  readonly rol = computed<Rol | null>(() => this.usuarioSignal()?.rol ?? null);

  private leerSesion(): Usuario | null {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Usuario) : null;
  }

  private guardarSesion(usuario: Usuario): void {
    localStorage.setItem(SESSION_KEY, JSON.stringify(usuario));
    this.usuarioSignal.set(usuario);
  }

  iniciarSesion(correo: string, password: string): Observable<Usuario> {
    if (!environment.useMockData && environment.backend === 'supabase') {
      return from(this.iniciarSesionSupabase(correo, password));
    }
    return this.iniciarSesionMock(correo, password);
  }

  private iniciarSesionMock(correo: string, password: string): Observable<Usuario> {
    const usuario = SEED_USUARIOS.find(u => u.correo.toLowerCase() === correo.toLowerCase() && u.activo);
    if (!usuario || password !== MOCK_PASSWORD) {
      return throwError(() => new Error('Correo o contraseña incorrectos')).pipe(delay(400));
    }
    this.guardarSesion(usuario);
    return of(usuario).pipe(delay(400));
  }

  private async iniciarSesionSupabase(correo: string, password: string): Promise<Usuario> {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: correo,
      password
    });
    if (authError || !authData.user) {
      throw new Error('Correo o contraseña incorrectos');
    }
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('authUserId', authData.user.id)
      .eq('activo', true)
      .maybeSingle();
    if (error || !usuario) {
      await supabase.auth.signOut();
      throw new Error('El usuario no tiene un perfil activo en el sistema');
    }
    this.guardarSesion(usuario as Usuario);
    return usuario as Usuario;
  }

  cerrarSesion(): void {
    localStorage.removeItem(SESSION_KEY);
    this.usuarioSignal.set(null);
    if (!environment.useMockData && environment.backend === 'supabase') {
      supabase.auth.signOut();
    }
  }
}
