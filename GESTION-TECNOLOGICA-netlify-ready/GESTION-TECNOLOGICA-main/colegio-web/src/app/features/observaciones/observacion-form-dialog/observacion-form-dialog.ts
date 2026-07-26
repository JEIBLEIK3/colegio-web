import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Estudiante, TipoObservacion } from '../../../core/models/models';

export interface ObservacionDialogData {
  estudiantes: Estudiante[];
  estudianteId?: string;
}

@Component({
  selector: 'app-observacion-form-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './observacion-form-dialog.html'
})
export class ObservacionFormDialog {
  private readonly fb = inject(FormBuilder);
  private readonly ref = inject(MatDialogRef<ObservacionFormDialog>);
  readonly data = inject<ObservacionDialogData>(MAT_DIALOG_DATA);

  readonly form = this.fb.nonNullable.group({
    estudianteId: [this.data.estudianteId ?? '', Validators.required],
    tipo: ['Positiva' as TipoObservacion, Validators.required],
    titulo: ['', Validators.required],
    descripcion: ['', Validators.required],
    compromiso: ['']
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
