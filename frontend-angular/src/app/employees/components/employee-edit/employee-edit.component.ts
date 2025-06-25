import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { Employee } from '@app/employees/models/employee.model';
import { EmployeeService } from '@app/employees/services/employee.service';

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Toast],
  providers: [MessageService],
  template: `
    <div class="container mx-auto p-6">
      <p-toast></p-toast>
      <div class="bg-white shadow-lg rounded-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-bold text-gray-900">
            {{ isEditMode ? 'Modifier l\'Employé' : 'Nouvel Employé' }}
          </h1>
          <button 
            (click)="goBack()"
            class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
            Annuler
          </button>
        </div>

        <form [formGroup]="employeeForm" (ngSubmit)="onSubmit()" class="space-y-6">
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
                <div *ngIf="employeeForm.get('id')?.errors?.['required'] && employeeForm.get('id')?.touched" 
                     class="text-red-500 text-sm mt-1">
                  L'ID est requis
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                <input 
                  type="text" 
                  formControlName="name"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Date de naissance</label>
                <input 
                  type="date" 
                  formControlName="birth"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input 
                  type="email" 
                  formControlName="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <div *ngIf="employeeForm.get('email')?.errors?.['required'] && employeeForm.get('email')?.touched" 
                     class="text-red-500 text-sm mt-1">
                  L'email est requis
                </div>
                <div *ngIf="employeeForm.get('email')?.errors?.['email'] && employeeForm.get('email')?.touched" 
                     class="text-red-500 text-sm mt-1">
                  Format d'email invalide
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                <input 
                  type="tel" 
                  formControlName="phone"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                <textarea 
                  formControlName="address"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
            </div>
          </div>

          <!-- Informations professionnelles -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Informations Professionnelles</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Poste</label>
                <input 
                  type="text" 
                  formControlName="job"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Salaire</label>
                <input 
                  type="number" 
                  formControlName="salary"
                  min="0"
                  step="0.01"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <div *ngIf="employeeForm.get('salary')?.errors?.['min'] && employeeForm.get('salary')?.touched" 
                     class="text-red-500 text-sm mt-1">
                  Le salaire doit être positif
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Début de contrat</label>
                <input 
                  type="date" 
                  formControlName="contractStart"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Fin de contrat</label>
                <input 
                  type="date" 
                  formControlName="contractEnd"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <small class="text-gray-500">Laisser vide pour un CDI</small>
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
              [disabled]="employeeForm.invalid || loading"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50">
              {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class EmployeeEditComponent implements OnInit {
  employeeForm: FormGroup;
  isEditMode = false;
  loading = false;
  employeeId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private messageService: MessageService
  ) {
    this.employeeForm = this.createForm();
  }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.employeeId;

    if (this.isEditMode && this.employeeId) {
      this.loadEmployee(this.employeeId);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      id: ['', Validators.required],
      name: [''],
      birth: [''],
      address: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      job: [''],
      salary: ['', [Validators.min(0)]],
      contractStart: [''],
      contractEnd: [''],
      comment: ['']
    });
  }

  private loadEmployee(id: string): void {
    this.loading = true;

    this.employeeService.getById(id, {
      next: (employee) => {
        if (employee) {
          this.employeeForm.patchValue({
            id: employee.id, // ID obligatoire
            name: employee.name || '',
            birth: employee.birth || '',
            address: employee.address || '',
            email: employee.email, // Email obligatoire
            phone: employee.phone || '',
            job: employee.job || '',
            salary: employee.salary ?? '',
            contractStart: employee.contractStart || '',
            contractEnd: employee.contractEnd || '',
            comment: employee.comment || ''
          });
        }
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Erreur lors du chargement de l\'employé'
        });
        this.loading = false;
        console.error('Error loading employee:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      this.loading = true;

      const formData = this.employeeForm.value;
      const employee: Employee = {
        id: formData.id, // ID obligatoire
        name: formData.name && formData.name !== '-' ? formData.name : undefined,
        birth: formData.birth && formData.birth !== '-' ? formData.birth : undefined,
        address: formData.address && formData.address !== '-' ? formData.address : undefined,
        email: formData.email, // Email obligatoire
        phone: formData.phone && formData.phone !== '-' ? formData.phone : undefined,
        job: formData.job && formData.job !== '-' ? formData.job : undefined,
        salary: formData.salary && formData.salary !== '-' && formData.salary !== '' ? Number(formData.salary) : undefined,
        contractStart: formData.contractStart && formData.contractStart !== '-' ? formData.contractStart : undefined,
        contractEnd: formData.contractEnd && formData.contractEnd !== '-' ? formData.contractEnd : null,
        comment: formData.comment || undefined, // Les commentaires vides deviennent undefined
        vacations: [],
        absences: []
      };

      const resultHandler = {
        next: () => {
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: `Employé ${this.isEditMode ? 'modifié' : 'créé'} avec succès`
          });
          this.router.navigate(['/employees']);
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: error.message || 'Erreur lors de l\'enregistrement de l\'employé'
          });
          this.loading = false;
          console.error('Error saving employee:', error);
        }
      };

      if (this.isEditMode && this.employeeId) {
        this.employeeService.update(this.employeeId, employee, resultHandler);
      } else {
        this.employeeService.create(employee, resultHandler);
      }
    }
  }

  goBack(): void {
    if (this.isEditMode && this.employeeId) {
      this.router.navigate(['/employees/view', this.employeeId]);
    } else {
      this.router.navigate(['/employees']);
    }
  }
}
