import {
  Component, OnInit,
  ChangeDetectorRef, ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder,
         FormGroup, Validators, AbstractControl,
         ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { RoleService } from '../../../core/services/role.service';
import { AuthService } from '../../../core/services/auth.service';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';

function passwordMatchValidator(g: AbstractControl): ValidationErrors | null {
  const pass    = g.get('password')?.value;
  const confirm = g.get('confirmPassword')?.value;
  return pass === confirm ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, Sidebar],
  templateUrl: './register.html'
})
export class RegisterComponent implements OnInit {
  registerForm!:  FormGroup;
  loading         = false;
  errorMessage    = '';
  successMessage  = '';
  roles:          any[]    = [];

  // ✅ Mode flag — true when Admin is adding a user
  isAdminMode     = false;

  constructor(
    private fb:          FormBuilder,
    private userService: UserService,
    private roleService: RoleService,
    private authService: AuthService,
    private route:       ActivatedRoute,
    private router:      Router,
    private cdr:         ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // ✅ Detect mode from route data
    this.isAdminMode = !!this.route.snapshot.data['adminMode'];

    this.registerForm = this.fb.group({
      userName:        ['', Validators.required],
      email:           ['', [Validators.required, Validators.email]],
      address:         ['', Validators.required],
      password:        ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      // ✅ roleId only required in admin mode
      roleId:          [
        '',
        this.isAdminMode ? Validators.required : []
      ]
    }, { validators: passwordMatchValidator });

    // Load roles only in admin mode
    if (this.isAdminMode) this.loadRoles();
  }

  loadRoles(): void {
    this.roleService.getAllRoles().subscribe({
      next: (res) => {
        if (res.success) {
          this.roles = res.data;
          this.cdr.detectChanges();
        }
      },
      error: () => {}
    });
  }

  isInvalid(field: string): boolean {
    const c = this.registerForm.get(field);
    return !!(c?.invalid && c?.touched);
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    this.loading      = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    const payload: any = {
      userName: this.registerForm.value.userName,
      email:    this.registerForm.value.email,
      address:  this.registerForm.value.address,
      password: this.registerForm.value.password
    };

    // ✅ Include roleId only in admin mode
    if (this.isAdminMode) {
      payload.roleId = +this.registerForm.value.roleId;
    }

    this.userService.register(payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.successMessage = this.isAdminMode
            ? 'User created successfully!'
            : 'Registration successful! Redirecting to login...';
          this.cdr.detectChanges();
          setTimeout(() => {
            // ✅ Admin goes to dashboard, public goes to login
            this.router.navigate(
              this.isAdminMode ? ['/dashboard'] : ['/login']
            );
          }, 1500);
        } else {
          this.errorMessage = res.message || 'Registration failed.';
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Unable to connect.';
        this.loading      = false;
        this.cdr.detectChanges();
      }
    });
  }

  goBack(): void {
    this.router.navigate(
      this.isAdminMode ? ['/dashboard'] : ['/']
    );
  }
}
