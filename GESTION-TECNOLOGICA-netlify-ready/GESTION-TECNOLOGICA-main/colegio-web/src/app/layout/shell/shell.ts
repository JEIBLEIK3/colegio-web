import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { Rol } from '../../core/models/models';

interface ItemMenu {
  ruta: string;
  etiqueta: string;
  icono: string;
  roles: Rol[];
}

const MENU: ItemMenu[] = [
  { ruta: '/dashboard', etiqueta: 'Panel principal', icono: 'dashboard', roles: ['admin', 'profesor', 'estudiante'] },
  { ruta: '/matriculas', etiqueta: 'Matrículas', icono: 'how_to_reg', roles: ['admin'] },
  { ruta: '/profesores', etiqueta: 'Profesores', icono: 'badge', roles: ['admin'] },
  { ruta: '/horarios', etiqueta: 'Horarios', icono: 'schedule', roles: ['admin', 'profesor', 'estudiante'] },
  { ruta: '/asistencia', etiqueta: 'Asistencia', icono: 'fact_check', roles: ['admin', 'profesor'] },
  { ruta: '/notas', etiqueta: 'Notas', icono: 'grade', roles: ['admin', 'profesor', 'estudiante'] },
  { ruta: '/observaciones', etiqueta: 'Observaciones', icono: 'chat', roles: ['admin', 'profesor'] },
  { ruta: '/boletines', etiqueta: 'Boletines', icono: 'summarize', roles: ['admin', 'profesor', 'estudiante'] },
  { ruta: '/pagos', etiqueta: 'Pagos', icono: 'payments', roles: ['admin', 'estudiante'] }
];

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet, RouterLink, RouterLinkActive, MatSidenavModule, MatToolbarModule,
    MatListModule, MatIconModule, MatButtonModule, MatMenuModule, MatTooltipModule
  ],
  templateUrl: './shell.html',
  styleUrl: './shell.scss'
})
export class Shell {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly breakpointObserver = inject(BreakpointObserver);

  readonly usuario = this.auth.usuario;

  readonly esMovil = toSignal(
    this.breakpointObserver.observe(Breakpoints.Handset).pipe(map(r => r.matches)),
    { initialValue: false }
  );

  readonly menu = computed(() => {
    const rol = this.auth.rol();
    if (!rol) return [];
    return MENU.filter(item => item.roles.includes(rol));
  });

  readonly etiquetaRol: Record<Rol, string> = {
    admin: 'Administrador',
    profesor: 'Profesor',
    estudiante: 'Estudiante / Acudiente'
  };

  cerrarSesion(): void {
    this.auth.cerrarSesion();
    this.router.navigateByUrl('/login');
  }
}
