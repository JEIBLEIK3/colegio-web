import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

export interface NotaDialogData {
  estudianteNombre: string;
  asignatura: string;
  periodo: number;
}

@Component({
  selector: 'app-nota-form-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './nota-form-dialog.html'
})
export class NotaFormDialog {
  private readonly fb = inject(FormBuilder);
  private readonly ref = inject(MatDialogRef<NotaFormDialog>);
  readonly data = inject<NotaDialogData>(MAT_DIALOG_DATA);

  readonly form = this.fb.nonNullable.group({
    descripcion: ['', Validators.required],
    valor: [4.0, [Validators.required, Validators.min(0), Validators.max(5)]],
    porcentaje: [20, [Validators.required, Validators.min(1), Validators.max(100)]]
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
