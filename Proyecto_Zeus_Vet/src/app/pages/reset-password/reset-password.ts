import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; 
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrls: ['../login/login.css']
})
export class ResetPassword implements OnInit {

  resetForm: FormGroup;
  token: string | null = null;
  message: string = '';
  error: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute 
  ) {
    this.resetForm = this.fb.group({
      nuevaContrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', [Validators.required]]
    }, { validators: this.passwordsMatch });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token');
    if (!this.token) {
      this.error = 'Token de recuperación no encontrado. Acceso denegado.';
    }
  }

  // ✅ Verifica que ambas contraseñas coincidan
  private passwordsMatch(formGroup: FormGroup) {
    const pass = formGroup.get('nuevaContrasena')?.value;
    const confirm = formGroup.get('confirmarContrasena')?.value;
    return pass === confirm ? null : { notMatch: true };
  }

  onSubmit(): void {
    if (this.resetForm.invalid || !this.token) {
      this.resetForm.markAllAsTouched();
      return;
    }

    const nuevaContrasena = this.resetForm.value.nuevaContrasena;
    this.message = '';
    this.error = '';
    this.loading = true;

    this.authService.resetPassword(this.token, nuevaContrasena).subscribe({
      next: (response) => {
        this.message = '✅ Contraseña restablecida con éxito. Redirigiendo...';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Error al restablecer la contraseña. Intenta nuevamente.';
      }
    });
  }

  get nuevaContrasena() { return this.resetForm.get('nuevaContrasena'); }
  get confirmarContrasena() { return this.resetForm.get('confirmarContrasena'); }
}
