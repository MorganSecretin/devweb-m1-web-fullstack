import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Applicant } from '@app/applicants/models/applicant.model';
import { ApplicantService } from '@app/applicants/services/applicants.service';
import { EmployeeService } from '@app/employees/services/employee.service';
import { Employee } from '@app/employees/models/employee.model';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-applicant',
    standalone: true,
    template: `
        <div class="flex gap-4 items-center">
            <h2>Candidats</h2>
            <p-button severity="primary" (click)="startCreate()">Ajouter</p-button>
        </div>
        <p-table [value]="applicants" [tableStyle]="{ 'min-width': '50rem' }">
            <ng-template pTemplate="header">
                <tr>
                    <th>Nom</th>
                    <th>Domaine</th>
                    <th>Email</th>
                    <th>Téléphone</th>
                    <th>Action</th>
                </tr>
            </ng-template>
            <ng-template pTemplate="body" let-applicant>
                <tr>
                    <td>{{ applicant.person?.name || '' }}</td>
                    <td>{{ applicant.domain || '' }}</td>
                    <td>{{ applicant.person?.email || '' }}</td>
                    <td>{{ applicant.person?.phone || '' }}</td>
                    <td class="flex gap-2">
                        <p-button severity="success" (click)="view(applicant)">Voir</p-button>
                        <p-button severity="info" (click)="update(applicant)">Mettre à jour</p-button>
                        <p-button severity="secondary" (click)="hire(applicant)">Embaucher</p-button>
                        <p-button severity="danger" (click)="delete(applicant)">Supprimer</p-button>
                    </td>
                </tr>
            </ng-template>
        </p-table>
    `,
    imports: [CommonModule, TableModule, ButtonModule],
})
export class ApplicantComponent {
    protected readonly applicants: Applicant[] = [];

    constructor(
        private readonly applicantService: ApplicantService,
        private readonly employeeService: EmployeeService,
        private readonly router: Router
    ) {}

    ngOnInit() {
        this.load();
    }

    load() {
        // Vider le tableau avant de charger
        this.applicants.length = 0;
        
        this.applicantService.getAll({
            next: (data) => {
                this.applicants.push(...data);
                console.log('Applicants loaded:', this.applicants.length);
            },
            error: (error) => {
                console.error('Error loading applicants:', error);
            }
        });
    }    startCreate() {
        // Navigation vers la page de création d'un nouveau candidat
        this.router.navigate(['/applicants/new']);
    }

    view(applicant: Applicant) {
        // Navigation vers la page de détails du candidat
        if (applicant && applicant.person && applicant.person.id) {
            this.router.navigate(['/applicants/view', applicant.person.id]);
        }
    }

    update(applicant: Applicant) {
        // Navigation vers la page de modification du candidat
        if (applicant && applicant.person && applicant.person.id) {
            this.router.navigate(['/applicants/edit', applicant.person.id]);
        }
    }

    delete(applicant: Applicant) {
        // Confirmer avant suppression
        if (applicant && applicant.person && applicant.person.id) {
            const name = applicant.person.name || 'ce candidat';
            if (confirm(`Êtes-vous sûr de vouloir supprimer ${name} ?`)) {
                this.applicantService.delete(applicant.person.id, {
                    next: () => {
                        // Recharger la liste
                        this.load();
                    },
                    error: (error) => {
                        console.error('Erreur lors de la suppression du candidat:', error);
                    }
                });
            }
        }
    }

    hire(applicant: Applicant) {
        // Confirmer avant embauche
        if (applicant && applicant.person && applicant.person.id) {
            const name = applicant.person.name || 'ce candidat';
            if (confirm(`Êtes-vous sûr de vouloir embaucher ${name} ?`)) {
                // Créer un employé à partir du candidat
                const employee: Employee = {
                    id: applicant.person.id,
                    person: applicant.person,
                    job: applicant.domain || '', // Utiliser le domaine comme poste initial
                    salary: 0, // Salaire initial à 0, à modifier ensuite
                    contractStart: new Date().toISOString().split('T')[0], // Date d'aujourd'hui
                    contractEnd: null,
                    comment: `Embauché depuis la candidature. Note: ${applicant.note !== undefined ? applicant.note + '/20' : 'N/A'}`,
                    vacations: [],
                    absences: []
                };

                this.employeeService.create(employee, {
                    next: () => {
                        alert(`${name} a été embauché avec succès !`);
                        // Supprimer le candidat après embauche réussie
                        this.applicantService.delete(applicant.person.id, {
                            next: () => {
                                this.load(); // Recharger la liste
                            },
                            error: (error) => {
                                console.error('Erreur lors de la suppression du candidat après embauche:', error);
                                this.load(); // Recharger quand même
                            }
                        });
                    },
                    error: (error) => {
                        console.error('Erreur lors de l\'embauche:', error);
                        alert('Erreur lors de l\'embauche. Veuillez réessayer.');
                    }
                });
            }
        }
    }
}