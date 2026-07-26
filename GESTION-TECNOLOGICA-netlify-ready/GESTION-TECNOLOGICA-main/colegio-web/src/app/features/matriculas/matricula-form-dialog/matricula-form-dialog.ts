import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Curso, Estudiante } from '../../../core/models/models';

export interface MatriculaDialogData {
  estudiante: Estudiante | null;
  cursos: Curso[];
}

@Component({
  selector: 'app-matricula-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule
  ],
  templateUrl: './matricula-form-dialog.html'
})
export class MatriculaFormDialog {
  private readonly fb = inject(FormBuilder);
  private readonly ref = inject(MatDialogRef<MatriculaFormDialog>);
  readonly data = inject<MatriculaDialogData>(MAT_DIALOG_DATA);

  readonly esEdicion = !!this.data.estudiante;

  readonly form = this.fb.nonNullable.group({
    nombres: [this.data.estudiante?.nombres ?? '', Validators.required],
    apellidos: [this.data.estudiante?.apellidos ?? '', Validators.required],
    tipoDocumento: [this.data.estudiante?.tipoDocumento ?? 'TI', Validators.required],
    documento: [this.data.estudiante?.documento ?? '', Validators.required],
    fechaNacimiento: [this.data.estudiante?.fechaNacimiento ?? '', Validators.required],
    genero: [this.data.estudiante?.genero ?? 'M', Validators.required],
    direccion: [this.data.estudiante?.direccion ?? ''],
    telefono: [this.data.estudiante?.telefono ?? ''],
    correo: [this.data.estudiante?.correo ?? '', Validators.email],
    acudienteNombre: [this.data.estudiante?.acudienteNombre ?? '', Validators.required],
    acudienteTelefono: [this.data.estudiante?.acudienteTelefono ?? '', Validators.required],
    acudienteCorreo: [this.data.estudiante?.acudienteCorreo ?? '', Validators.email],
    cursoId: [this.data.estudiante?.cursoId ?? '', Validators.required],
    estadoMatricula: [this.data.estudiante?.estadoMatricula ?? 'Pendiente', Validators.required],
    observacionesMedicas: [this.data.estudiante?.observacionesMedicas ?? '']
  });

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.ref.close(this.form.getRawValue());
  }

  cancelar(): void {
    this.ref.close();
  }
}
