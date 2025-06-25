import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Employee } from '@app/employees/models/employee.model';
import { Absence } from '@app/employees/models/abscence.model';
import { Vacation } from '@app/employees/models/vacation.model';
import { EmployeeService } from '@app/employees/services/employee.service';

// PrimeNG imports
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-employee-view',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    DialogModule, 
    ButtonModule, 
    InputTextModule, 
    TextareaModule,
    CalendarModule
  ],
  template: `
    <div class="container mx-auto p-6">
      <div class="bg-white shadow-lg rounded-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-bold text-gray-900">Détails de l'Employé</h1>
          <div class="space-x-2">
            <button 
              (click)="editEmployee()"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Modifier
            </button>
            <button 
              (click)="showAbsenceDialog()"
              class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
              Ajouter Retard
            </button>
            <button 
              (click)="showVacationDialog()"
              class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Ajouter Congé
            </button>
            <button 
              (click)="goBack()"
              class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
              Retour
            </button>
          </div>
        </div>

        <div *ngIf="employee" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Informations personnelles -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h2 class="text-xl font-semibold text-gray-800 mb-4">Informations Personnelles</h2>
              <div class="space-y-3">
                <div>
                  <label class="text-sm font-medium text-gray-600">ID:</label>
                  <p class="text-gray-900">{{ employee.id }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-600">Nom:</label>
                  <p class="text-gray-900">{{ employee.name || '-' }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-600">Date de naissance:</label>
                  <p class="text-gray-900">{{ employee.birth ? (employee.birth | date:'dd/MM/yyyy') : '-' }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-600">Adresse:</label>
                  <p class="text-gray-900">{{ employee.address || '-' }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-600">Email:</label>
                  <p class="text-gray-900">{{ employee.email }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-600">Téléphone:</label>
                  <p class="text-gray-900">{{ employee.phone || '-' }}</p>
                </div>
              </div>
            </div>

            <!-- Informations professionnelles -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h2 class="text-xl font-semibold text-gray-800 mb-4">Informations Professionnelles</h2>
              <div class="space-y-3">
                <div>
                  <label class="text-sm font-medium text-gray-600">Poste:</label>
                  <p class="text-gray-900">{{ employee.job || '-' }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-600">Salaire:</label>
                  <p class="text-gray-900">{{ employee.salary !== null && employee.salary !== undefined ? (employee.salary | currency:'EUR':'symbol':'1.2-2') : '-' }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-600">Début de contrat:</label>
                  <p class="text-gray-900">{{ employee.contractStart ? (employee.contractStart | date:'dd/MM/yyyy') : '-' }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-600">Fin de contrat:</label>
                  <p class="text-gray-900">
                    {{ employee.contractEnd ? (employee.contractEnd | date:'dd/MM/yyyy') : 'CDI' }}
                  </p>
                </div>
                <div *ngIf="employee.comment">
                  <label class="text-sm font-medium text-gray-600">Commentaire:</label>
                  <p class="text-gray-900">{{ employee.comment }}</p>
                </div>
              </div>
            </div>
          </div>          <!-- Congés -->
          <div *ngIf="employee.vacations && employee.vacations.length > 0" class="bg-gray-50 p-4 rounded-lg">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Congés</h2>
            <div class="overflow-x-auto">
              <table class="min-w-full bg-white">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">ID</th>
                    <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">Date de début</th>
                    <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">Date de fin</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr *ngFor="let vacation of employee.vacations">
                    <td class="px-4 py-2 text-sm text-gray-900">{{ vacation.id }}</td>
                    <td class="px-4 py-2 text-sm text-gray-900">{{ vacation.startDate | date:'dd/MM/yyyy' }}</td>
                    <td class="px-4 py-2 text-sm text-gray-900">{{ vacation.endDate | date:'dd/MM/yyyy' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Absences -->
          <div *ngIf="employee.absences && employee.absences.length > 0" class="bg-gray-50 p-4 rounded-lg">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Absences</h2>
            <div class="overflow-x-auto">
              <table class="min-w-full bg-white">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">ID</th>
                    <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">Date</th>
                    <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">Description</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr *ngFor="let absence of employee.absences">
                    <td class="px-4 py-2 text-sm text-gray-900">{{ absence.id }}</td>
                    <td class="px-4 py-2 text-sm text-gray-900">{{ absence.date | date:'dd/MM/yyyy' }}</td>
                    <td class="px-4 py-2 text-sm text-gray-900">{{ absence.description || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div *ngIf="!employee && !loading" class="text-center py-8">
          <p class="text-gray-500">Employé non trouvé</p>
        </div>

        <div *ngIf="loading" class="text-center py-8">
          <p class="text-gray-500">Chargement...</p>
        </div>

        <div *ngIf="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {{ error }}
        </div>
      </div>
    </div>

    <!-- Dialog pour ajouter une absence -->
    <p-dialog header="Ajouter un Retard" [(visible)]="absenceDialogVisible" [modal]="true" [style]="{width: '450px'}">
      <div class="space-y-4">
        <div>
          <label for="absenceDate" class="block text-sm font-medium text-gray-700 mb-2">Date</label>
          <p-calendar 
            id="absenceDate"
            [(ngModel)]="newAbsence.date" 
            [showIcon]="true"
            dateFormat="dd/mm/yy"
            placeholder="Sélectionner une date"
            appendTo="body"
            class="w-full">
          </p-calendar>
        </div>
        <div>
          <label for="absenceDescription" class="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea 
            id="absenceDescription"
            [(ngModel)]="newAbsence.description" 
            pInputTextarea
            rows="3"
            placeholder="Description du retard"
            class="w-full">
          </textarea>
        </div>
      </div>
      <ng-template pTemplate="footer">
        <button 
          pButton 
          type="button" 
          label="Annuler" 
          class="p-button-text"
          (click)="absenceDialogVisible = false">
        </button>
        <button 
          pButton 
          type="button" 
          label="Enregistrer" 
          (click)="saveAbsence()"
          [disabled]="!newAbsence.date">
        </button>
      </ng-template>
    </p-dialog>

    <!-- Dialog pour ajouter un congé -->
    <p-dialog header="Ajouter un Congé" [(visible)]="vacationDialogVisible" [modal]="true" [style]="{width: '450px'}">
      <div class="space-y-4">
        <div>
          <label for="vacationStartDate" class="block text-sm font-medium text-gray-700 mb-2">Date de début</label>
          <p-calendar 
            id="vacationStartDate"
            [(ngModel)]="newVacation.startDate" 
            [showIcon]="true"
            dateFormat="dd/mm/yy"
            placeholder="Sélectionner la date de début"
            appendTo="body"
            class="w-full">
          </p-calendar>
        </div>
        <div>
          <label for="vacationEndDate" class="block text-sm font-medium text-gray-700 mb-2">Date de fin</label>
          <p-calendar 
            id="vacationEndDate"
            [(ngModel)]="newVacation.endDate" 
            [showIcon]="true"
            dateFormat="dd/mm/yy"
            placeholder="Sélectionner la date de fin"
            appendTo="body"
            class="w-full">
          </p-calendar>
        </div>
      </div>
      <ng-template pTemplate="footer">
        <button 
          pButton 
          type="button" 
          label="Annuler" 
          class="p-button-text"
          (click)="vacationDialogVisible = false">
        </button>
        <button 
          pButton 
          type="button" 
          label="Enregistrer" 
          (click)="saveVacation()"
          [disabled]="!newVacation.startDate || !newVacation.endDate">
        </button>
      </ng-template>
    </p-dialog>
  `
})
export class EmployeeViewComponent implements OnInit {
  employee: Employee | null = null;
  loading = false;
  error: string | null = null;

  // Dialog states
  absenceDialogVisible = false;
  vacationDialogVisible = false;

  // New absence and vacation objects
  newAbsence: Partial<Absence> = {
    date: '',
    description: ''
  };

  newVacation: Partial<Vacation> = {
    startDate: '',
    endDate: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEmployee(id);
    }
  }

  private loadEmployee(id: string): void {
    this.loading = true;
    this.error = null;
    
    this.employeeService.getById(id, {
      next: (data) => {
        this.employee = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement de l\'employé';
        this.loading = false;
        console.error('Error loading employee:', error);
      }
    });
  }

  editEmployee(): void {
    if (this.employee && this.employee.id) {
      this.router.navigate(['/employees/edit', this.employee.id]);
    }
  }

  goBack(): void {
    this.router.navigate(['/employees']);
  }

  showAbsenceDialog(): void {
    this.newAbsence = {
      date: '',
      description: ''
    };
    this.absenceDialogVisible = true;
  }

  showVacationDialog(): void {
    this.newVacation = {
      startDate: '',
      endDate: ''
    };
    this.vacationDialogVisible = true;
  }

  saveAbsence(): void {
    if (!this.employee || !this.newAbsence.date) {
      return;
    }

    const absenceToSave = {
      date: this.formatDateForBackend(this.newAbsence.date),
      description: this.newAbsence.description || ''
    };

    this.employeeService.addAbsenceToEmployee(this.employee.id, absenceToSave, {
      next: (updatedEmployee) => {
        this.employee = updatedEmployee;
        this.absenceDialogVisible = false;
        this.newAbsence = { date: '', description: '' };
      },
      error: (error) => {
        this.error = 'Erreur lors de l\'ajout de l\'absence';
        console.error('Error adding absence:', error);
      }
    });
  }

  saveVacation(): void {
    if (!this.employee || !this.newVacation.startDate || !this.newVacation.endDate) {
      return;
    }

    const vacationToSave = {
      startDate: this.formatDateForBackend(this.newVacation.startDate),
      endDate: this.formatDateForBackend(this.newVacation.endDate)
    };

    this.employeeService.addVacationToEmployee(this.employee.id, vacationToSave, {
      next: (updatedEmployee) => {
        this.employee = updatedEmployee;
        this.vacationDialogVisible = false;
        this.newVacation = { startDate: '', endDate: '' };
      },
      error: (error) => {
        this.error = 'Erreur lors de l\'ajout du congé';
        console.error('Error adding vacation:', error);
      }
    });
  }

  private formatDateForBackend(date: any): string {
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    if (typeof date === 'string') {
      return date;
    }
    return '';
  }
}
