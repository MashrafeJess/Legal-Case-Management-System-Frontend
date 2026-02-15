import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CaseService } from '../../../core/services/case.service';
import { AuthService } from '../../../core/services/auth.service';
import { FileService } from '../../../core/services/file.service';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-case-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, Sidebar],
  providers: [DatePipe],
  templateUrl: './case-detail.html'
})
export class CaseDetail implements OnInit {
  caseDetail:  any    = null;
  loading             = true;
  errorMessage        = '';
  isAdmin             = false;
  isLawyer            = false;
  caseId!:     number;

  constructor(
    private route:       ActivatedRoute,
    private router:      Router,
    private caseService: CaseService,
    private authService: AuthService,
    private fileService: FileService,
    private cdr:         ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const role    = this.authService.getRole();
    this.isAdmin  = role === 'Admin';
    this.isLawyer = role === 'Lawyer';
    this.caseId   = +this.route.snapshot.paramMap.get('id')!;
    this.loadCase();
  }

  loadCase(): void {
    this.loading      = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.caseService.getById(this.caseId).subscribe({
      next: (res) => {
        if (res.success) this.caseDetail = res.data;
        else this.errorMessage           = res.message;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load case.';
        this.loading      = false;
        this.cdr.detectChanges();
      }
    });
  }

  getFileIcon(contentType: string): string {
    if (contentType.includes('pdf'))   return '📄';
    if (contentType.includes('image')) return '🖼️';
    if (contentType.includes('word'))  return '📝';
    if (contentType.includes('sheet')) return '📊';
    return '📎';
  }

  formatSize(bytes: number): string {
    if (bytes < 1024)        return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  downloadFile(fileId: string, fileName: string): void {
    this.fileService.download(fileId).subscribe({
      next: (blob) => {
        const url  = window.URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.errorMessage = 'Failed to download file.';
        this.cdr.detectChanges();
      }
    });
  }

  editCase():   void { this.router.navigate(['/cases/edit', this.caseId]); }

  deleteCase(): void {
    if (!confirm('Delete this case?')) return;
    this.caseService.delete(this.caseId).subscribe({
      next: (res) => {
        if (res.success) this.router.navigate(['/cases']);
        else {
          this.errorMessage = res.message;
          this.cdr.detectChanges();
        }
      },
      error: () => {
        this.errorMessage = 'Failed to delete case.';
        this.cdr.detectChanges();
      }
    });
  }

  goBack(): void { this.router.navigate(['/cases']); }
}
