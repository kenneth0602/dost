import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, FormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

// Service
import { TrainingsService } from '../../trainings.service';

@Component({
  selector: 'app-answer-form',
  standalone: true,
  imports: [MatIconModule, FormsModule, MatCheckboxModule, CommonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatRadioModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './answer-form.component.html',
  styleUrl: './answer-form.component.scss',
  providers: [FormBuilder]
})
export class AnswerFormComponent {
  answerForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private service: TrainingsService,
    public dialogRef: MatDialogRef<AnswerFormComponent>
  ) { }

  ngOnInit(): void {
    const contents = this.data.formData?.contents || [];
    const formControls: { [key: string]: any } = {};

    contents.forEach((content: any) => {
      const isRequired = content.required === '1';

      if (content.type === 'checkbox') {
        // Create FormArray of FormControls (initially all false)
        const controls = content.options.map(() => new FormControl(false));
        const formArray = new FormArray(controls);

        if (isRequired) {
          formArray.setValidators([
            (control: AbstractControl): ValidationErrors | null => {
              const formArray = control as FormArray;
              return formArray.controls.some(c => c.value === true)
                ? null
                : { required: true };
            }
          ]);
        }

        formControls[content.contentID] = formArray;

      } else {
        // Other fields (radio, essay, etc.)
        formControls[content.contentID] = new FormControl('', isRequired ? [Validators.required] : []);
      }
    });

    this.answerForm = this.fb.group(formControls);
  }


onSubmit(): void {
    console.log('🟡 onSubmit called with data:', {
    answerFormValue: this.answerForm?.value,
    formContents: this.data?.formData?.contents,
    formId: this.data?.formId,
    userId: sessionStorage.getItem('userId'),
    token: sessionStorage.getItem('token')
  });
  if (this.answerForm.invalid) return;

  const rawValue = this.answerForm.value;
  const contents = this.data.formData.contents;
  const userid = sessionStorage.getItem('userId');
  const formid = this.data.formId;
  const token = sessionStorage.getItem('token');

  const payload = contents.map((content: any) => {
    const contentID = content.contentID;
    const value = rawValue[contentID];

    if (content.type === 'textbox') {
      return {
        userid,
        formid,
        contentid: contentID,
        option_value: content.options[0]?.value || ''
      };
    }

    if (content.type === 'essay') {
      return {
        userid,
        formid,
        contentid: contentID,
        option_value: value || ''
      };
    }

    if (content.type === 'radio') {
      const selectedOption = content.options.find((o: any) => o.value === value);
      return {
        userid,
        formid,
        contentid: contentID,
        optionid: selectedOption?.optionID,
        option_value: selectedOption?.value
      };
    }

    if (content.type === 'checkbox') {
      const selectedOptions = value
        .map((checked: boolean, i: number) => checked ? content.options[i] : null)
        .filter((v: any) => v !== null);

      return {
        userid,
        formid,
        contentid: contentID,
        optionid: selectedOptions.map((opt: any) => opt.optionID),
        option_value: selectedOptions.map((opt: any) => opt.value)
      };
    }

    return null;
  }).filter((p: any) => p !== null);

  const finalPayload = { data: payload }; // ✅ Wrap in { data }

  console.log('Submitting payload:', finalPayload);

  this.service.answerForm(finalPayload, token).subscribe({
    next: (response) => {
      console.log('Form submitted successfully:', response);
      // Optional: Close dialog, show message, etc.
    },
    error: (err) => {
      console.error('Form submission failed:', err);
    }
  });
}

}
