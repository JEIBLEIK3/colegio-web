import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Estudiante } from '../../../core/models/models';

export interface PagoDialogData {
  estudiantes: Estudiante[];
}

@Component({
  selector: 'app-pago-form-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './pago-form-dialog.html'
})
export class PagoFormDialog {
  private readonly fb = inject(FormBuilder);
  private readonly ref = inject(MatDialogRef<PagoFormDialog>);
  readonly data = inject<PagoDialogData>(MAT_DIALOG_DATA);

  readonly form = this.fb.nonNullable.group({
    estudianteId: ['', Validators.required],
    concepto: ['', Validators.required],
    periodo: [new Date().toISOString().slice(0, 7), Validators.required],
    monto: [350000, [Validators.required, Validators.min(1)]],
    fechaVencimiento: [new Date().toISOString().slice(0, 10), Validators.required]
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
