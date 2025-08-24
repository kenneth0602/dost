import { Component } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// Angular Material
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatRippleModule} from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatDividerModule} from '@angular/material/divider';
import {MatTooltipModule} from '@angular/material/tooltip';

// Service
import { Auth } from '../auth';

interface User {
  userType: string;
}

@Component({
  selector: 'app-login',
  providers: [DatePipe],
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatRippleModule,
            FormsModule, MatIconModule, MatSelectModule, MatDividerModule, CommonModule,
            MatTooltipModule, ReactiveFormsModule
           ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  users: User[] = [
    {userType: 'HRDP'},
    {userType: 'SDU'}
  ]

  selecterUser = this.users[0].userType;
  today = Date.now();
  hide = true;
  signingIn: boolean = false;
  errorMessage: string = '';
  signInForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router
  ) {
    this.signInForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  async onLogin() {
    if (this.signInForm.invalid) {
      return;
    }
    
    try {
      this.signingIn = true;
      const form = this.signInForm.value;
      this.authService.login(form).subscribe((data) => {
        sessionStorage.setItem('token', data.token)
        this.router.navigate(['supervisor/library']);
      });
    } catch (error) {
      console.log('Login Failed', error);
    } finally {
      this.signingIn = false;
    }
  }
}
