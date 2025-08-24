import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { Signatories, Signatory } from '../selection-criteria/selection-criteria.component';

const DEFAULT_NAMES = {
  chair: 'Chairperson Name',
  vice: 'Vice-Chairperson Name',
  atd: 'ATD Member Name',
  mprd: 'MPRD Member Name',
  pd: 'PD Member Name',
  pmd: 'PMD Member Name',
  tdd: 'TDD Member Name',
  tsss: 'TSSS Member Name',
  rfr: 'Rank & File Rep Name',
} as const;

@Component({
  selector: 'app-scholarship-signatories',
  standalone: true,
  imports: [
    CommonModule, MatDialogModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatDatepickerModule, MatNativeDateModule, MatDividerModule
  ],
  templateUrl: './scholarship-signatories.component.html',
  styleUrl: './scholarship-signatories.component.scss'
})
export class ScholarshipSignatoriesComponent {
  private fb  = inject(FormBuilder);
  private ref = inject(MatDialogRef<ScholarshipSignatoriesComponent>);

  // Fixed-role, non-nullable form
// Your form:
form = this.fb.nonNullable.group({
  chair: this.fb.nonNullable.group({
    name: [DEFAULT_NAMES.chair, Validators.required],
    title: ['Chairperson (FAD)'],
  }),
  vice: this.fb.nonNullable.group({
    name: [DEFAULT_NAMES.vice, Validators.required],
    title: ['Vice-Chairperson (FAD-AGSS)'],
  }),
  atd: this.fb.nonNullable.group({
    name: [DEFAULT_NAMES.atd, Validators.required],
    title: ['Member (ATD)'],
  }),
  mprd: this.fb.nonNullable.group({
    name: [DEFAULT_NAMES.mprd, Validators.required],
    title: ['Member (MPRD)'],
  }),
  pd: this.fb.nonNullable.group({
    name: [DEFAULT_NAMES.pd, Validators.required],
    title: ['Member (PD)'],
  }),
  pmd: this.fb.nonNullable.group({
    name: [DEFAULT_NAMES.pmd, Validators.required],
    title: ['Member (PMD)'],
  }),
  tdd: this.fb.nonNullable.group({
    name: [DEFAULT_NAMES.tdd, Validators.required],
    title: ['Member (TDD)'],
  }),
  tsss: this.fb.nonNullable.group({
    name: [DEFAULT_NAMES.tsss, Validators.required],
    title: ['Member (TSSS)'],
  }),
  rfr: this.fb.nonNullable.group({
    name: [DEFAULT_NAMES.rfr, Validators.required],
    title: ['Member (Rank and File Representative)'],
  }),
  date: this.fb.nonNullable.control<Date>(new Date()),
});

  cancel(): void {
    this.ref.close();
  }

  confirm(): void {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();

    const members: Signatory[] = [
      v.vice, v.atd, v.mprd, v.pd, v.pmd, v.tdd, v.tsss, v.rfr
    ].filter(m => !!m.name && m.name.trim().length > 0);

    const result: Signatories = {
      chair: v.chair,
      members,
      date: v.date.toISOString().slice(0, 10),
      // recommendingApproval / approvedBy intentionally omitted
    };

    this.ref.close(result);
  }
}
