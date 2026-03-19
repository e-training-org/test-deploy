import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule,RouterLink, CommonModule],
  templateUrl: './sign-up.html',
  styleUrls: ['./sign-up.css'],
})
export class Signup implements OnInit {
  signupForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const formData = this.signupForm.value;

      this.auth.signup(formData).subscribe({
        next: (res: { success: boolean; message?: string }) => {
          if (res.success) {
            alert('Signup successful 🎉');
            this.router.navigate(['/login']);
          } else {
            alert(res.message || 'Signup failed');
          }
        },
        error: (err: any) => {
          console.error('Signup failed:', err);
          alert('Signup request failed. Please try again.');
        },
      });
    }
  }
}
