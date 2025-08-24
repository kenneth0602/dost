import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, AbstractControl, FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

// Service
import { FeaturesService } from '../../../../features.service';

// Component
import { ConfirmMessageComponent } from '../../../../../shared/components/confirm-message/confirm-message.component';

// Validators
import { disallowCharacters, allowOnlyNumeric, cellphoneNumberValidator, emailValidator } from '../../../../../shared/utils/validators';

interface formType {
  value: string
}

interface selectedFormType {
  value: string
}

@Component({
  selector: 'app-view-form',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatGridListModule, MatDialogModule, MatButtonModule, MatDividerModule,
    MatCardModule, MatIconModule, FormsModule, ReactiveFormsModule, CommonModule, MatSelectModule, MatCheckboxModule, MatSlideToggleModule
  ],
  templateUrl: './view-form.component.html',
  styleUrl: './view-form.component.scss'
})
export class ViewFormComponent {

  dataSource: formType[] = [
    { value: 'Pre-Test' },
    { value: 'Post-Test' },
    { value: 'Feedback' }
  ];

  formTypes: selectedFormType[] = [
    { value: 'Textbox' },
    { value: 'Essay' },
    { value: 'Radio' },
    { value: 'Checkbox' }
  ]
  usedFormTypes: string[] = [];
  formGroup!: FormGroup;
  apID!: string;
  formID!: string;
  programName!: string;
  dateTo!: string;
  dateFrom!: string;

  constructor(private fb: FormBuilder,
    private dialogRef: MatDialogRef<ViewFormComponent>,
    private featuresService: FeaturesService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.apID = this.data?.apID || '1';
    this.usedFormTypes = this.data?.usedFormTypes || [];
    this.formID = this.data?.formId || '';
    console.log('Received formId in dialog:', this.formID);
    const formData = this.data?.formData;

    this.formGroup = this.fb.group({
      typeValue: [formData?.typeValue || ''],
      training: [formData?.training || ''],
      fields: this.fb.array([])
    });

    if (formData?.contents?.length) {
      formData.contents.forEach((field: any) => {
        const capitalizedType = this.capitalize(field.type);

        const fieldGroup = this.fb.group({
          selectedFieldType: [capitalizedType, Validators.required],
          description: [field.label, Validators.required],
          required: [field.required === '1' || field.required === 'yes' ? true : ''],
          points: [+field.points || 0],
          correctAnswer: [
            field.correct_answer && field.correct_answer !== 'undefined'
              ? field.correct_answer
              : '',
            Validators.required,
          ],
          options: this.fb.array([]),
        });

        // Push to fields array
        (this.formGroup.get('fields') as FormArray).push(fieldGroup);
        // 👉 Set options BEFORE validations
        const optionsArray = fieldGroup.get('options') as FormArray;
        optionsArray.clear();
        field.options?.forEach((opt: string) => {
          optionsArray.push(this.fb.group({ value: opt }));
        });

        // ✅ Set correctAnswer AFTER options are in
        const correctAnswerControl = fieldGroup.get('correctAnswer');
        if (
          field.correct_answer &&
          field.correct_answer !== 'undefined' &&
          field.options?.includes(field.correct_answer)
        ) {
          correctAnswerControl?.setValue(field.correct_answer);
        }

        // 👉 Now initialize validations (adds default options if necessary)
        this.handleFieldTypeValidation(fieldGroup);

        // 👉 Trigger valueChanges manually
        fieldGroup.get('selectedFieldType')?.setValue(capitalizedType, { emitEvent: true });
      });
    }

    this.formGroup.get('typeValue')?.valueChanges.subscribe(value => {
      if (value === 'Feedback') {
        this.setDefaultValuesIfFeedback();
      }
    });
  }

      onClose(): void {
        console.log('Closing...')
    this.dialogRef.close();
  }

  capitalize(type: string): string {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }

  get fields(): FormGroup[] {
    return (this.formGroup.get('fields') as FormArray).controls as FormGroup[];
  }

  createOption(required = true): FormGroup {
    return this.fb.group({
      value: required ? ['', Validators.required] : ['']
    });
  }

  getOptions(field: AbstractControl): FormArray {
    return field.get('options') as FormArray;
  }

  addField(): FormGroup {
    const fieldGroup = this.fb.group({
      selectedFieldType: ['', Validators.required],
      description: ['', Validators.required],
      required: [false],
      points: [0],
      correctAnswer: [''],
      options: this.fb.array([])
    });

    (this.formGroup.get('fields') as FormArray).push(fieldGroup);
    return fieldGroup; // ✅ return it
  }

  handleFieldTypeValidation(fieldGroup: FormGroup) {
    const typeControl = fieldGroup.get('selectedFieldType');

    typeControl?.valueChanges.subscribe((type: string) => {
      const optionsArray = fieldGroup.get('options') as FormArray;
      const correctAnswerControl = fieldGroup.get('correctAnswer');

      // Clear validators (but do not clear options blindly)
      correctAnswerControl?.clearValidators();

      // Only auto-populate options if the array is empty
      if ((type === 'Radio' || type === 'Checkbox') && optionsArray.length === 0) {
        optionsArray.push(this.createOption());
        optionsArray.push(this.createOption());
        correctAnswerControl?.setValidators([Validators.required]);
      } else if (type === 'Essay') {
        correctAnswerControl?.setValidators([Validators.required]);
        // Essay does not need options
      }

      correctAnswerControl?.updateValueAndValidity();
    });

    // Trigger validation rules
    typeControl?.updateValueAndValidity({ onlySelf: false, emitEvent: true });
  }



  getOptionControls(field: AbstractControl): AbstractControl[] {
    return (field.get('options') as FormArray).controls;
  }

  addOption(field: AbstractControl): void {
    this.getOptions(field).push(this.createOption());
  }

  removeOption(field: AbstractControl, index: number): void {
    const options = this.getOptions(field);
    if (options.length > 1) {
      options.removeAt(index);
    }
  }

  submitForm(): void {
    if (this.formGroup.invalid) {
      console.warn('Form is invalid:', this.formGroup);

      const mainControls = this.formGroup.controls;
      console.group('Top-level form controls:');
      for (const key in mainControls) {
        const control = mainControls[key];
        if (control.invalid) {
          console.warn(`- ${key} is invalid`, control.errors, control.value);
        }
      }
      console.groupEnd();

      const fieldsArray = this.formGroup.get('fields') as FormArray;
      console.group('Field controls:');
      fieldsArray.controls.forEach((ctrl, index) => {
        const group = ctrl as FormGroup;
        if (group.invalid) {
          console.warn(`Field ${index} is invalid:`);

          Object.keys(group.controls).forEach(key => {
            const fieldControl = group.get(key);
            if (fieldControl && fieldControl.invalid) {
              console.warn(`  - ${key}: invalid`, fieldControl.errors, fieldControl.value);
            }
          });
        }
      });
      console.groupEnd();

      this.formGroup.markAllAsTouched();
      return;
    }

    const jwt = sessionStorage.getItem('token');
    if (!jwt) {
      console.error('JWT token missing');
      return;
    }

    const rawForm = this.formGroup.value;
    const isFeedback = rawForm.typeValue === 'Feedback';

    const payload = {
      apID: this.apID, // Replace dynamically as needed
      typeValue: rawForm.typeValue,
      training: rawForm.training || '',
      contents: rawForm.fields.map((field: any) => {
        const isEssay = field.selectedFieldType.toLowerCase() === 'essay';

        const base: Record<string, any> = {
          type: field.selectedFieldType.toLowerCase(),
          required: field.required ? '1' : '0',
          label: field.description,
          options: field.options?.length
            ? field.options.map((opt: any) => opt.value || '')
            : ['', '']
        };

        // Always include correct_answer for Essay
        if (isEssay) {
          base['correct_answer'] = field.correctAnswer || '';
        }

        // Only include points if not Feedback
        if (!isFeedback) {
          base['points'] = field.points;

          // Also include correct_answer for non-essay questions in non-feedback forms
          if (!isEssay) {
            base['correct_answer'] = field.correctAnswer || '';
          }
        }

        return base;
      })
    };

    this.featuresService.updateForms(payload, jwt, this.formID).subscribe({
      next: () => {
        console.log('Form created.');
        this.dialogRef.close();
      },
      error: (err) => console.error('Failed to create form', err)
    });
  }

  getCorrectAnswerControl(field: AbstractControl): FormControl {
    return field.get('correctAnswer') as FormControl;
  }

  setDefaultValuesIfFeedback(): void {
    const defaultFields = [
      {
        selectedFieldType: 'Textbox',
        required: "",
        description: "Learning Program and Resource Speaker's Evaluation Form",
        options: [],
        correctAnswer: '',
        points: 0
      },
      {
        selectedFieldType: 'Textbox',
        required: "",
        description: "TRAINING COURSE",
        options: [],
        correctAnswer: '',
        points: 0
      },
      {
        selectedFieldType: 'Radio',
        required: "",
        description: "Relevance of program to the job",
        options: ['1', '2', '3', '4', '5'],
        correctAnswer: '',
        points: 0
      },
      {
        selectedFieldType: 'Radio',
        required: "",
        description: "Course objectives achieved",
        options: ['1', '2', '3', '4', '5'],
        correctAnswer: '',
        points: 0
      },
      {
        selectedFieldType: 'Radio',
        required: "",
        description: "Sequencing of Topics",
        options: ['1', '2', '3', '4', '5'],
        correctAnswer: '',
        points: 0
      },
      {
        selectedFieldType: 'Radio',
        required: "",
        description: "Length of session/program duration",
        options: ['1', '2', '3', '4', '5'],
        correctAnswer: '',
        points: 0
      },
      {
        selectedFieldType: 'Radio',
        required: "",
        description: "Clarity of instructional materials",
        options: ['1', '2', '3', '4', '5'],
        correctAnswer: '',
        points: 0
      },
      {
        selectedFieldType: 'Radio',
        required: "",
        description: "Appropriateness of exercises/quiz/test",
        options: ['1', '2', '3', '4', '5'],
        correctAnswer: '',
        points: 0
      },
      {
        selectedFieldType: 'Radio',
        required: "",
        description: "Immediate application of new knowledge and skills to current job",
        options: ['1', '2', '3', '4', '5'],
        correctAnswer: '',
        points: 0
      },
      {
        selectedFieldType: 'Textbox',
        required: "",
        description: "RESOURCE SPEAKER - PROJECTION (Name of Resource Speaker)",
        options: [],
        correctAnswer: '',
        points: 0
      },
      {
        selectedFieldType: 'Radio',
        required: "",
        description: "Appearance",
        options: ['1', '2', '3', '4', '5'],
        correctAnswer: '',
        points: 0
      },
      {
        selectedFieldType: 'Radio',
        required: "",
        description: "Speech",
        options: ['1', '2', '3', '4', '5'],
        correctAnswer: '',
        points: 0
      },
      {
        selectedFieldType: 'Radio',
        required: "",
        description: "Voice",
        options: ['1', '2', '3', '4', '5'],
        correctAnswer: '',
        points: 0
      },
      {
        selectedFieldType: 'Textbox',
        required: "",
        description: "RESOURCE SPEAKER - TECHNICAL COMPETENCE (Name of Resource Speaker)",
        options: [],
        correctAnswer: '',
        points: 0
      },
      {
        selectedFieldType: 'Radio',
        required: "",
        description: "Ability to communicate ideas",
        options: ['1', '2', '3', '4', '5'],
        correctAnswer: '',
        points: 0
      },
      {
        selectedFieldType: 'Radio',
        required: "",
        description: "Ability to carry on with the discussion",
        options: ['1', '2', '3', '4', '5'],
        correctAnswer: '',
        points: 0
      },
      {
        selectedFieldType: 'Radio',
        required: "",
        description: "Ability to illustrate and clarify points",
        options: ['1', '2', '3', '4', '5'],
        correctAnswer: '',
        points: 0
      },
      {
        selectedFieldType: 'Radio',
        required: "",
        description: "Ability to satisfy inquiries",
        options: ['1', '2', '3', '4', '5'],
        correctAnswer: '',
        points: 0
      },
      {
        selectedFieldType: 'Textbox',
        required: "",
        description: "RESOURCE SPEAKER - SEMINAR MANAGEMENT (Name of Resource Speaker)",
        options: [],
        correctAnswer: '',
        points: 0
      },
      {
        selectedFieldType: 'Radio',
        required: "",
        description: "Voice (Seminar Management)",
        options: ['1', '2', '3', '4', '5'],
        correctAnswer: '',
        points: 0
      },
      {
        selectedFieldType: 'Radio',
        required: "",
        description: "Preparation and planning",
        options: ['1', '2', '3', '4', '5'],
        correctAnswer: '',
        points: 0
      },
      {
        selectedFieldType: 'Radio',
        required: "",
        description: "Sequencing of course content",
        options: ['1', '2', '3', '4', '5'],
        correctAnswer: '',
        points: 0
      },
      {
        selectedFieldType: 'Radio',
        required: "",
        description: "Time management",
        options: ['1', '2', '3', '4', '5'],
        correctAnswer: '',
        points: 0
      },
      {
        selectedFieldType: 'Textbox',
        required: "",
        description: "Program Coordinator (Name of Programs Coordinator)",
        options: [],
        correctAnswer: '',
        points: 0
      },
      {
        selectedFieldType: 'Radio',
        required: "",
        description: "Cooperativeness",
        options: ['1', '2', '3', '4', '5'],
        correctAnswer: '',
        points: 0
      },
      {
        selectedFieldType: 'Radio',
        required: "",
        description: "Sensitivity to participant's needs",
        options: ['1', '2', '3', '4', '5'],
        correctAnswer: '',
        points: 0
      },
      {
        selectedFieldType: 'Essay',
        required: "",
        description: "PROBLEMS ENCOUNTERED DURING THE SESSION",
        options: [],
        correctAnswer: '',
        points: 0
      },
      {
        selectedFieldType: 'Essay',
        required: "",
        description: "COMMENTS/SUGGESTIONS FOR THE IMPROVEMENT OF THE PROGRAM",
        options: [],
        correctAnswer: '',
        points: 0
      }
    ];

    const fieldsArray = this.fb.array(
      defaultFields.map(field =>
        this.fb.group({
          selectedFieldType: [field.selectedFieldType, Validators.required],
          required: "",
          description: [field.description, Validators.required],
          correctAnswer: [field.correctAnswer],
          points: [field.points],
          options: this.fb.array(
            field.options.map(opt =>
              this.fb.group({ value: [opt, Validators.required] })
            )
          )
        })
      )
    );

    this.formGroup = this.fb.group({
      typeValue: ['Feedback', Validators.required],
      training: [''],
      fields: fieldsArray
    });
  }


  get isFeedbackForm(): boolean {
    return this.formGroup.get('typeValue')?.value === 'Feedback';
  }

}
