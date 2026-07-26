import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Curso, Profesor } from '../../../core/models/models';

export interface ProfesorDialogData {
  profesor: Profesor | null;
  cursos: Curso[];
}

@Component({
  selector: 'app-profesor-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatSlideToggleModule
  ],
  templateUrl: './profesor-form-dialog.html'
})
export class ProfesorFormDialog {
  private readonly fb = inject(FormBuilder);
  private readonly ref = inject(MatDialogRef<ProfesorFormDialog>);
  readonly data = inject<ProfesorDialogData>(MAT_DIALOG_DATA);

  readonly esEdicion = !!this.data.profesor;

  readonly form = this.fb.nonNullable.group({
    nombres: [this.data.profesor?.nombres ?? '', Validators.required],
    apellidos: [this.data.profesor?.apellidos ?? '', Validators.required],
    documento: [this.data.profesor?.documento ?? '', Validators.required],
    correo: [this.data.profesor?.correo ?? '', [Validators.required, Validators.email]],
    telefono: [this.data.profesor?.telefono ?? '', Validators.required],
    especialidad: [this.data.profesor?.especialidad ?? '', Validators.required],
    asignaturasTexto: [(this.data.profesor?.asignaturas ?? []).join(', ')],
    cursosAsignados: [this.data.profesor?.cursosAsignados ?? []],
    fechaIngreso: [this.data.profesor?.fechaIngreso ?? new Date().toISOString().slice(0, 10), Validators.required],
    activo: [this.data.profesor?.activo ?? true]
  });

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const asignaturas = raw.asignaturasTexto.split(',').map(a => a.trim()).filter(Boolean);
    const { asignaturasTexto, ...resto } = raw;
    this.ref.close({ ...resto, asignaturas });
  }

  cancelar(): void {
    this.ref.close();
  }
}
