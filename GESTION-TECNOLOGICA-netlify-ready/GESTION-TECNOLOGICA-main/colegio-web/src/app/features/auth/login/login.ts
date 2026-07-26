import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);
  readonly ocultarPassword = signal(true);

  readonly form = this.fb.nonNullable.group({
    correo: ['admin@colegio.edu.co', [Validators.required, Validators.email]],
    password: ['colegio123', [Validators.required]]
  });

  readonly usuariosDemo = [
    { correo: 'admin@colegio.edu.co', rol: 'Administrador' },
    { correo: 'laura.gomez@colegio.edu.co', rol: 'Profesor' },
    { correo: 'juan.perez@estudiante.edu.co', rol: 'Estudiante / Acudiente' }
  ];

  usarDemo(correo: string): void {
    this.form.patchValue({ correo, password: 'colegio123' });
  }

  ingresar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.error.set(null);
    this.cargando.set(true);
    const { correo, password } = this.form.getRawValue();
    this.auth.iniciarSesion(correo, password).subscribe({
      next: () => {
        this.cargando.set(false);
        this.router.navigateByUrl('/dashboard');
      },
      error: (err: Error) => {
        this.cargando.set(false);
        this.error.set(err.message);
      }
    });
  }
}
