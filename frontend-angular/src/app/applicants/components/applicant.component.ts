import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Applicant } from '@app/applicants/models/applicant.model';
import { ApplicantService } from '@app/applicants/services/applicants.service';
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
                    <td>{{ applicant.person.name }}</td>
                    <td>{{ applicant.domain }}</td>
                    <td>{{ applicant.person.email }}</td>
                    <td>{{ applicant.person.phone }}</td>
                    <td class="flex gap-2">
                        <p-button severity="success" (click)="view(applicant)">Voir</p-button>
                        <p-button severity="info" (click)="update(applicant)">Mettre à jour</p-button>
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

    constructor(private readonly applicantService: ApplicantService) {}

    ngOnInit() {
        this.load();
    }

    load() {
        this.applicantService.getAll({
            next: (data) => {
                this.applicants.push(...data);
                console.log('Applicants loaded:', this.applicants.length);
            },
            error: (error) => {
                console.error('Error loading applicants:', error);
            }
        });
    }

    startCreate() {
        // Implémenter la logique pour démarrer la création d'un nouvel employé
        console.log('Démarrer la création d\'un nouvel employé');
    }

    view(applicant: Applicant) {
        // Implémenter la logique pour voir les détails de l'employé
        console.log('Voir', applicant);
    }

    update(applicant: Applicant) {
        // Implémenter la logique pour mettre à jour l'employé
        console.log('Mettre à jour', applicant);
    }

    delete(applicant: Applicant) {
        // Implémenter la logique pour supprimer l'employé
        this.applicantService.delete(applicant.id, {
            next: () => {
                this.load(); // Recharger la liste après suppression
            },
            error: (error) => {
                console.error('Erreur lors de la suppression de l\'employé:', error);
            }
        });
    }
}