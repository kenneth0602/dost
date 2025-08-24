import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

export type ProgramType = 'Grad' | 'NonDeg';

export interface Signatory {
  name: string;
  title?: string;
}

export interface Signatories {
  chair?: Signatory;
  members: Signatory[];           // 0..n
  recommendingApproval?: Signatory;
  approvedBy?: Signatory;
  date?: string;                  // ISO string (e.g., 2025-08-23)
}

export interface CriteriaResult {
  programType: ProgramType;
  choices: {
    relevance: 'duties' | 'division' | 'mandate';
    frequency?: 'none' | 'other' | 'similar'; // present only for NonDeg
    performance: 'OO' | 'O_VS' | 'VS_VS';
    transfer: 'effectiveVS' | 'tapped' | 'capable';
  };
  total: number;
  breakdown: { relevance: number; frequency: number; performance: number; transfer: number };
}

export interface EndorsedRow {
  fullName: string;
  position: string;
  division: string;
  scholarshipTitle: string;
  criteria?: CriteriaResult; // <- optional, filled by your dialog
}

type RelevanceKey = keyof typeof POINTS.relevance;   // 'duties' | 'division' | 'mandate'
type FrequencyKey = keyof typeof POINTS.frequency;   // 'none' | 'other' | 'similar'
type PerformanceKey = keyof typeof POINTS.performance; // 'OO' | 'O_VS' | 'VS_VS'
type TransferKey = keyof typeof POINTS.transfer;     // 'effectiveVS' | 'tapped' | 'capable'

const POINTS = {
  relevance: {
    duties:   { Grad: 40, NonDeg: 35 },
    division: { Grad: 32, NonDeg: 28 },
    mandate:  { Grad: 24, NonDeg: 21 },
  },
  frequency: {
    none:     { Grad: 0,  NonDeg: 25 }, // N.A. for Grad → 0
    other:    { Grad: 0,  NonDeg: 20 },
    similar:  { Grad: 0,  NonDeg: 15 },
  },
  performance: {
    OO:       { Grad: 35, NonDeg: 20 },
    O_VS:     { Grad: 28, NonDeg: 16 },
    VS_VS:    { Grad: 21, NonDeg: 12 },
  },
  transfer: {
    effectiveVS: { Grad: 25, NonDeg: 20 },
    tapped:      { Grad: 20, NonDeg: 16 },
    capable:     { Grad: 15, NonDeg: 12 },
  },
} as const;

@Component({
  selector: 'app-selection-criteria',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, MatRadioModule, MatButtonModule, MatCardModule, MatButtonToggleModule, MatDividerModule, MatIconModule],
  templateUrl: './selection-criteria.component.html',
  styleUrl: './selection-criteria.component.scss'
})
export class SelectionCriteriaComponent {
  private fb = inject(FormBuilder);
  
  form = this.fb.group({
    programType: ['NonDeg' as ProgramType, Validators.required],
    relevance: ['duties', Validators.required],
    frequency: ['none'], // enabled only if NonDeg
    performance: ['OO', Validators.required],
    transfer: ['effectiveVS', Validators.required],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<SelectionCriteriaComponent>
  ) {
    this.form.get('programType')!.valueChanges.subscribe(pt => {
      if (pt === 'Grad') {
        this.form.get('frequency')!.disable({ emitEvent: false });
      } else {
        this.form.get('frequency')!.enable({ emitEvent: false });
      }
    });
  }

    get isGrad() {
    return this.form.get('programType')!.value === 'Grad';
  }

  // Expose a live score preview for the footer
  get preview() {
    return this.score(); // reuse your existing score() method
  }

private score(): CriteriaResult {
  const v = this.form.getRawValue();
  const pt = v.programType as ProgramType;

  const rel  = v.relevance  as RelevanceKey;
  const freq = (v.frequency ?? 'none') as FrequencyKey; // safe default when Grad
  const perf = v.performance as PerformanceKey;
  const xfer = v.transfer   as TransferKey;

  const b = {
    relevance:   POINTS.relevance[rel][pt],
    frequency:   pt === 'NonDeg' ? POINTS.frequency[freq][pt] : 0,
    performance: POINTS.performance[perf][pt],
    transfer:    POINTS.transfer[xfer][pt],
  };

  const total = Object.values(b).reduce((s, n) => s + n, 0);

  return {
    programType: pt,
    choices: {
      relevance: rel,
      frequency: pt === 'NonDeg' ? freq : undefined,
      performance: perf,
      transfer: xfer,
    },
    total,
    breakdown: b,
  };
}

  confirm() {
    if (this.form.invalid) return;
    this.ref.close(this.score());
  }

  cancel() {
    this.ref.close();
  }
}
