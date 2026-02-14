import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { UserService } from '../../../../app/core/services/user.service';
import { RoleService } from '../../../../app/core/services/role.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading        = false;
  errorMessage   = '';
  successMessage = '';
  roles: any[]   = [];

  constructor(
    private fb:          FormBuilder,
    private userService: UserService,
    private roleService: RoleService,
    private router:      Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      userName:        ['', Validators.required],
      email:           ['', [Validators.required, Validators.email]],
      address:         [''],
      password:        ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      roleId: 0
    }, { validators: this.passwordMatchValidator });

  }

  // ── Custom validator ──
  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const pw      = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pw === confirm ? null : { passwordMismatch: true };
  }

  get passwordMismatch(): boolean {
    return !!(
      this.registerForm.hasError('passwordMismatch') &&
      this.registerForm.get('confirmPassword')?.touched
    );
  }

  isInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control?.invalid && control?.touched);
  }

  // loadRoles(): void {
  //   this.roleService.getAllRoles().subscribe({
  //     next: (res) => {
  //       if (res.success) this.roles = res.data;
  //     },
  //     error: () => {
  //       this.errorMessage = 'Failed to load roles.';
  //     }
  //   });
  // }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading      = true;
    this.errorMessage = '';

    const { confirmPassword, ...payload } = this.registerForm.value;
    console.log(payload);

    this.userService.register(payload).subscribe({
      next: (res) => {
        console.log(payload);
        if (res.success) {
          this.successMessage = 'Registration successful! Redirecting to login...';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        } else {
          this.errorMessage = res.message || 'Registration failed.';
        }
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Unable to connect. Try again.';
        this.loading = false;
      }
    });
  }
}
