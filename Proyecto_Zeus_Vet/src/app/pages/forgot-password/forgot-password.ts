import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth'; 

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], 
  templateUrl: './forgot-password.html', 
  styleUrls: ['./forgot-password.css'] 
})
export class ForgotPassword implements OnInit { 
  recoveryForm: FormGroup;
  message: string = '';
  error: string = '';
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.recoveryForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }


  ngOnInit(): void { }

  onSubmit(): void {
    if (this.recoveryForm.invalid) {
      this.recoveryForm.markAllAsTouched();
      return;
    }

    this.message = '';
    this.error = '';
    const email = this.recoveryForm.value.email;

    this.authService.requestPasswordReset(email).subscribe({ 
      next: (response) => {
        this.message = 'Si la cuenta existe, se ha enviado un enlace de recuperación a tu correo.';
        this.recoveryForm.reset();
      },
      error: (err) => {
        this.error = err.error?.error || 'Error del servidor al solicitar el restablecimiento.';
      }
    });
  }

  get email() { return this.recoveryForm.get('email'); }
}