import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.html'
})
export class LandingComponent {
  features = [
    {
      icon: '⚖️',
      title: 'Case Management',
      desc: 'Track and manage all your legal cases efficiently.'
    },
    {
      icon: '📅',
      title: 'Hearings',
      desc: 'Schedule and monitor hearing dates with reminders.'
    },
    {
      icon: '💳',
      title: 'Payments',
      desc: 'Secure online payments via SSLCommerz.'
    },
    {
      icon: '📁',
      title: 'Documents',
      desc: 'Upload and manage case files and evidence.'
    },
    {
      icon: '💬',
      title: 'Comments',
      desc: 'Collaborate with case updates and comments.'
    }
  ];
}
