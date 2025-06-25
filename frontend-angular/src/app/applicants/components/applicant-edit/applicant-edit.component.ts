import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Applicant } from '@app/applicants/models/applicant.model';
import { ApplicantService } from '@app/applicants/services/applicants.service';

@Component({
  selector: 'app-applicant-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToastModule],
  providers: [MessageService],
  template: `
    <div class="container mx-auto p-6">
      <p-toast></p-toast>
      <div class="bg-white shadow-lg rounded-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-bold text-gray-900">
            {{ isEditMode ? 'Modifier le Candidat' : 'Nouveau Candidat' }}
          </h1>
          <button 
            (click)="goBack()"
            class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
            Annuler
          </button>
        </div>

        <form [formGroup]="applicantForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- Informations personnelles -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Informations Personnelles</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">ID *</label>
                <input 
                  type="text" 
                  formControlName="id"
                  [readonly]="isEditMode"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  [class.bg-gray-100]="isEditMode">
                <div *ngIf="applicantForm.get('id')?.errors?.['required'] && applicantForm.get('id')?.touched" 
                     class="text-red-500 text-sm mt-1">
                  L'ID est requis
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                <input 
                  type="text" 
                  formControlName="name"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <div *ngIf="applicantForm.get('name')?.errors?.['required'] && applicantForm.get('name')?.touched" 
                     class="text-red-500 text-sm mt-1">
                  Le nom est requis
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Date de naissance *</label>
                <input 
                  type="date" 
                  formControlName="birth"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <div *ngIf="applicantForm.get('birth')?.errors?.['required'] && applicantForm.get('birth')?.touched" 
                     class="text-red-500 text-sm mt-1">
                  La date de naissance est requise
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input 
                  type="email" 
                  formControlName="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <div *ngIf="applicantForm.get('email')?.errors?.['required'] && applicantForm.get('email')?.touched" 
                     class="text-red-500 text-sm mt-1">
                  L'email est requis
                </div>
                <div *ngIf="applicantForm.get('email')?.errors?.['email'] && applicantForm.get('email')?.touched" 
                     class="text-red-500 text-sm mt-1">
                  Format d'email invalide
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                <input 
                  type="tel" 
                  formControlName="phone"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <div *ngIf="applicantForm.get('phone')?.errors?.['required'] && applicantForm.get('phone')?.touched" 
                     class="text-red-500 text-sm mt-1">
                  Le téléphone est requis
                </div>
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">Adresse *</label>
                <textarea 
                  formControlName="address"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                <div *ngIf="applicantForm.get('address')?.errors?.['required'] && applicantForm.get('address')?.touched" 
                     class="text-red-500 text-sm mt-1">
                  L'adresse est requise
                </div>
              </div>
            </div>
          </div>

          <!-- Informations candidature -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Informations Candidature</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Note (0-20)</label>
                <input 
                  type="number" 
                  formControlName="note"
                  min="0" 
                  max="20"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <div *ngIf="applicantForm.get('note')?.errors?.['min'] && applicantForm.get('note')?.touched" 
                     class="text-red-500 text-sm mt-1">
                  La note doit être entre 0 et 20
                </div>
                <div *ngIf="applicantForm.get('note')?.errors?.['max'] && applicantForm.get('note')?.touched" 
                     class="text-red-500 text-sm mt-1">
                  La note doit être entre 0 et 20
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Domaine</label>
                <input 
                  type="text" 
                  formControlName="domain"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Date d'entretien</label>
                <input 
                  type="date" 
                  formControlName="interviewDate"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">Commentaire</label>
                <textarea 
                  formControlName="comment"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-4">
            <button 
              type="button"
              (click)="goBack()"
              class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
              Annuler
            </button>
            <button 
              type="submit"
              [disabled]="applicantForm.invalid || loading"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50">
              {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ApplicantEditComponent implements OnInit {
  applicantForm: FormGroup;
  isEditMode = false;
  loading = false;
  applicantId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private applicantService: ApplicantService,
    private messageService: MessageService
  ) {
    this.applicantForm = this.createForm();
  }

  ngOnInit(): void {
    this.applicantId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.applicantId;

    if (this.isEditMode && this.applicantId) {
      this.loadApplicant(this.applicantId);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      birth: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      note: ['', [Validators.min(0), Validators.max(20)]],
      domain: [''],
      interviewDate: [''],
      comment: ['']
    });
  }

  private loadApplicant(id: string): void {
    this.loading = true;

    this.applicantService.getById(id, {
      next: (applicant) => {
        if (applicant && applicant.person) {
          this.applicantForm.patchValue({
            id: applicant.person.id, // ID obligatoire, ne peut pas être null
            name: applicant.person.name || '',
            birth: applicant.person.birth || '',
            address: applicant.person.address || '',
            email: applicant.person.email, // Email obligatoire, ne peut pas être null
            phone: applicant.person.phone || '',
            note: applicant.note ?? '',
            domain: applicant.domain || '',
            interviewDate: applicant.interviewDate || '',
            comment: applicant.comment || '' // Pas de '-' pour les commentaires
          });
        }
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Erreur lors du chargement du candidat'
        });
        this.loading = false;
        console.error('Error loading applicant:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.applicantForm.valid) {
      this.loading = true;

      const formData = this.applicantForm.value;
      const applicant: Applicant = {
        id: formData.id, // ID obligatoire
        person: {
          id: formData.id, // ID obligatoire
          name: formData.name && formData.name !== '-' ? formData.name : undefined,
          birth: formData.birth && formData.birth !== '-' ? formData.birth : undefined,
          address: formData.address && formData.address !== '-' ? formData.address : undefined,
          email: formData.email, // Email obligatoire
          phone: formData.phone && formData.phone !== '-' ? formData.phone : undefined
        },
        note: formData.note && formData.note !== '-' && formData.note !== '' ? Number(formData.note) : undefined,
        domain: formData.domain && formData.domain !== '-' ? formData.domain : undefined,
        interviewDate: formData.interviewDate && formData.interviewDate !== '-' ? formData.interviewDate : undefined,
        comment: formData.comment || undefined // Les commentaires vides deviennent undefined
      };

      const resultHandler = {
        next: () => {
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: `Candidat ${this.isEditMode ? 'modifié' : 'créé'} avec succès`
          });
          this.router.navigate(['/applicants']);
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: error.message || 'Erreur lors de l\'enregistrement du candidat'
          });
          this.loading = false;
          console.error('Error saving applicant:', error);
        }
      };

      if (this.isEditMode && this.applicantId) {
        this.applicantService.update(this.applicantId, applicant, resultHandler);
      } else {
        this.applicantService.create(applicant, resultHandler);
      }
    }
  }

  goBack(): void {
    if (this.isEditMode && this.applicantId) {
      this.router.navigate(['/applicants/view', this.applicantId]);
    } else {
      this.router.navigate(['/applicants']);
    }
  }
}
