import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { BloqueHorario, DiaSemana, Profesor } from '../../../core/models/models';

export interface HorarioDialogData {
  cursoId: string;
  profesores: Profesor[];
}

const DIAS: DiaSemana[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

@Component({
  selector: 'app-horario-form-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './horario-form-dialog.html'
})
export class HorarioFormDialog {
  private readonly fb = inject(FormBuilder);
  private readonly ref = inject(MatDialogRef<HorarioFormDialog>);
  readonly data = inject<HorarioDialogData>(MAT_DIALOG_DATA);

  readonly dias = DIAS;

  readonly form = this.fb.nonNullable.group({
    dia: ['Lunes' as DiaSemana, Validators.required],
    horaInicio: ['07:00', Validators.required],
    horaFin: ['07:50', Validators.required],
    asignatura: ['', Validators.required],
    profesorId: ['', Validators.required],
    aula: ['']
  });

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const bloque: Omit<BloqueHorario, 'id'> = { ...this.form.getRawValue(), cursoId: this.data.cursoId };
    this.ref.close(bloque);
  }

  cancelar(): void {
    this.ref.close();
  }
}
