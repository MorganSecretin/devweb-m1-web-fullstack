import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Applicant } from '@app/applicants/models/applicant.model';
import { ApplicantService } from '@app/applicants/services/applicants.service';

@Component({
  selector: 'app-applicant-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-6">
      <div class="bg-white shadow-lg rounded-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-bold text-gray-900">Détails du Candidat</h1>
          <div class="space-x-2">
            <button 
              (click)="editApplicant()"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Modifier
            </button>
            <button 
              (click)="goBack()"
              class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
              Retour
            </button>
          </div>
        </div>

        <div *ngIf="applicant && applicant.person" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Informations personnelles -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Informations Personnelles</h2>
            <div class="space-y-3">
              <div>
                <label class="text-sm font-medium text-gray-600">ID:</label>
                <p class="text-gray-900">{{ applicant.person.id }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-600">Nom:</label>
                <p class="text-gray-900">{{ applicant.person.name || '-' }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-600">Date de naissance:</label>
                <p class="text-gray-900">{{ applicant.person.birth ? (applicant.person.birth | date:'dd/MM/yyyy') : '-' }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-600">Adresse:</label>
                <p class="text-gray-900">{{ applicant.person.address || '-' }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-600">Email:</label>
                <p class="text-gray-900">{{ applicant.person.email }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-600">Téléphone:</label>
                <p class="text-gray-900">{{ applicant.person.phone || '-' }}</p>
              </div>
            </div>
          </div>

          <!-- Informations candidature -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Informations Candidature</h2>
            <div class="space-y-3">
              <div>
                <label class="text-sm font-medium text-gray-600">Note:</label>
                <p class="text-gray-900">{{ applicant.note !== undefined && applicant.note !== null ? applicant.note + '/20' : '-' }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-600">Domaine:</label>
                <p class="text-gray-900">{{ applicant.domain || '-' }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-600">Date d'entretien:</label>
                <p class="text-gray-900">{{ applicant.interviewDate ? (applicant.interviewDate | date:'dd/MM/yyyy') : '-' }}</p>
              </div>
              <div *ngIf="applicant.comment">
                <label class="text-sm font-medium text-gray-600">Commentaire:</label>
                <p class="text-gray-900">{{ applicant.comment }}</p>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="!applicant && !loading" class="text-center py-8">
          <p class="text-gray-500">Candidat non trouvé</p>
        </div>

        <div *ngIf="loading" class="text-center py-8">
          <p class="text-gray-500">Chargement...</p>
        </div>

        <div *ngIf="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {{ error }}
        </div>
      </div>
    </div>
  `
})
export class ApplicantViewComponent implements OnInit {
  applicant: Applicant | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private applicantService: ApplicantService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadApplicant(id);
    }
  }

  private loadApplicant(id: string): void {
    this.loading = true;
    this.error = null;
    
    this.applicantService.getById(id, {
      next: (data) => {
        this.applicant = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement du candidat';
        this.loading = false;
        console.error('Error loading applicant:', error);
      }
    });
  }

  editApplicant(): void {
    if (this.applicant && this.applicant.person && this.applicant.person.id) {
      this.router.navigate(['/applicants/edit', this.applicant.person.id]);
    }
  }

  goBack(): void {
    this.router.navigate(['/applicants']);
  }
}
