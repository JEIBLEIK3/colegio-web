import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PagosService } from '../../core/services/pagos.service';
import { EstudiantesService } from '../../core/services/estudiantes.service';
import { AuthService } from '../../core/auth/auth.service';
import { Pago } from '../../core/models/models';
import { PagoFormDialog } from './pago-form-dialog/pago-form-dialog';

@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [
    CurrencyPipe, MatTableModule, MatCardModule, MatButtonModule, MatIconModule,
    MatChipsModule, MatFormFieldModule, MatSelectModule, MatTooltipModule
  ],
  templateUrl: './pagos.html',
  styleUrl: './pagos.scss'
})
export class Pagos {
  private readonly pagosService = inject(PagosService);
  private readonly estudiantesService = inject(EstudiantesService);
  private readonly auth = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly esAdmin = computed(() => this.auth.rol() === 'admin');
  readonly filtroEstado = signal<string>('todos');

  readonly columnas = computed(() =>
    this.esAdmin()
      ? ['estudiante', 'concepto', 'monto', 'vencimiento', 'estado', 'acciones']
      : ['concepto', 'monto', 'vencimiento', 'estado']
  );

  readonly estudiantesActivos = computed(() => this.estudiantesService.items().filter(e => e.estadoMatricula === 'Activa'));

  readonly pagosVisibles = computed(() => {
    const rol = this.auth.rol();
    const usuario = this.auth.usuario();
    const base = rol === 'admin' ? this.pagosService.items() : this.pagosService.items().filter(p => p.estudianteId === usuario?.refId);
    const estado = this.filtroEstado();
    return base
      .filter(p => estado === 'todos' || p.estado === estado)
      .sort((a, b) => a.fechaVencimiento.localeCompare(b.fechaVencimiento));
  });

  readonly totalPendiente = computed(() =>
    this.pagosVisibles().filter(p => p.estado !== 'Pagado').reduce((s, p) => s + p.monto, 0)
  );

  nombreEstudiante(id: string): string {
    const e = this.estudiantesService.items().find(x => x.id === id);
    return e ? `${e.nombres} ${e.apellidos}` : '—';
  }

  claseChip(estado: string): string {
    return 'chip-' + estado.toLowerCase();
  }

  registrarCobro(): void {
    const ref = this.dialog.open(PagoFormDialog, {
      data: { estudiantes: this.estudiantesActivos() },
      width: '560px',
      maxWidth: '95vw'
    });

    ref.afterClosed().subscribe(resultado => {
      if (!resultado) return;
      const nuevo: Pago = { ...resultado, id: 'pg-' + crypto.randomUUID().slice(0, 8), estado: 'Pendiente' };
      this.pagosService.create(nuevo).subscribe(() =>
        this.snackBar.open('Cobro registrado', 'Cerrar', { duration: 2500 })
      );
    });
  }

  marcarComoPagado(pago: Pago): void {
    this.pagosService.update(pago.id, {
      estado: 'Pagado',
      fechaPago: new Date().toISOString().slice(0, 10),
      metodoPago: 'Transferencia',
      referencia: 'MAN-' + Math.floor(Math.random() * 90000 + 10000)
    }).subscribe(() => this.snackBar.open('Pago registrado', 'Cerrar', { duration: 2500 }));
  }
}
